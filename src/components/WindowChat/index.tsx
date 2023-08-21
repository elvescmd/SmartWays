import React, { useEffect, useRef, useState } from "react";
import IconChat from "../../assets/icons/smartways_logo.svg";
import { IoMdSend } from "react-icons/io";
import { useDispatch } from "react-redux";
import { ChatMessages } from "../ChatMessages";
import { setMessages } from "../../redux/chatSlice";
import { Bot } from "../../services/Bot";
import { MessageResponse } from "../../interfaces/responses/bot";

export const WindowChat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [responseIA, setResponseIA] = useState<boolean>(true);
  const dispatch = useDispatch();

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    dispatch(setMessages({ author: "user", message: message }));
    setMessage("");

    setResponseIA(false);

    
    const responseMessage = await Bot.post("completions", message) as MessageResponse;
    dispatch(setMessages({ author: "IA", message: responseMessage.choices[0].message.content }));
    setResponseIA(true);
  };

  const handleScrollDown = () => {
    const { current } = scrollRef;

    if (current && current.scrollHeight > current.offsetHeight) {
      current.scrollTop = current.scrollHeight - current.offsetHeight;
    }
  };

  useEffect(() => {
    handleScrollDown();
  }, [responseIA]);

  return (
    <div className="bg-dark-medium flex-1 flex flex-col justify-between">
      <header className="h-11 my-2 mx-3 flex justify-between items-center rounded-t-xl text-white-blue">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img src={IconChat} className="w-12" alt="SmartWays" />
            <span className="w-3 h-3 rounded-full bg-green block absolute bottom-0 right-0"></span>
          </div>
          <div>
            <h2 className="text-white-blue">SmartWays</h2>
            <p className="text-xs text-green font-semibold">{responseIA ? "Online" : "Digitando..."}</p>
          </div>
        </div>
      </header>

      <main
        className="flex-1 bg-dark text-white-blue overflow-y-auto p-5 relative"
        ref={scrollRef}
      >
        <ChatMessages />
      </main>

      <footer className="h-11 m-2 text-white-blue rounded-b-xl">
        <form
          className="flex items-center justify-between gap-2"
          onSubmit={handleSubmit}
        >
          <input
            disabled={responseIA === false}
            className="w-full bg-dark-light text-white-blue border-none outline-none px-3 h-10 rounded-[10px] text-xs md:text-sm disabled:cursor-not-allowed disabled:opacity-30"
            type="text"
            placeholder={
              responseIA === false
                ? "Aguarde a IA terminar de responder..."
                : "Digite sua mensagem"
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            disabled={message === ""}
            className="disabled:cursor-not-allowed"
            onClick={handleSubmit}
          >
            <IoMdSend className={`w-10 h-10 p-2 rounded-[10px] transition-colors
              ${message != ""
                  ? "bg-white-blue text-sky-blue"
                  : "bg-dark-light opacity-30"
              }`}
            />
          </button>
        </form>
      </footer>
    </div>
  );
};
