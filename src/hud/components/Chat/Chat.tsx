import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { chatWrapper, chat, messagesBox, message, input } from './chat.module.scss';

const Chat = (): JSX.Element => {
  const messages = new Array(30).fill('message').map((el, ind) => el.concat(` ${ind}`));
  const [currentMessage, setCurrentMessage] = useState('');

  const ref = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

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
            <div className={message}>{el}</div>
          ))}
        </div>
        <div className={input}>
          <input
            type="text"
            value={currentMessage}
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
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
