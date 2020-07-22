import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { chatWrapper, chat, messagesBox, message, input } from './chat.module.scss';
import { useMessage, useSocketSend } from '../../utils/socket/Socket';
import type { IncomingMessage } from '../../utils/socket/Socket';

export const getShortTime = (date: number): string => {
  const parsedDate = new Date(date);
  return parsedDate.toLocaleString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric',
  });
};

const Chat = (): JSX.Element => {
  const [messages, setMessages] = useState<ReadonlyArray<IncomingMessage>>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const ref = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  useMessage((incomingMessage) => {
    setMessages(messages.concat(incomingMessage));
  });

  const send = useSocketSend();
  useEffect(() => {
    const mouseScroll = (event: MouseWheelEvent) => {
      event.preventDefault();
      if (event.deltaY > 0) {
        ref.current.scrollTop += 17;
      } else {
        ref.current.scrollTop -= 17;
      }
    };

    if (ref.current) {
      ref.current.addEventListener('mousewheel', mouseScroll);
      return () => {
        ref.current.removeEventListener('mousewheel', mouseScroll);
      };
    }
  }, [ref]);
  return (
    <div className={chatWrapper}>
      <div className={chat}>
        <div className={messagesBox} ref={ref}>
          {messages.map((el) => (
            <div key={el.id} className={message}>
              <span>[{getShortTime(el.time)}]</span>
              <span>[{el.from.name}]</span> : {el.text}
            </div>
          ))}
        </div>
        <div className={input}>
          <input
            type="text"
            value={currentMessage}
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                send(currentMessage);
                setCurrentMessage('');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Chat;
