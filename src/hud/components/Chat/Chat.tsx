import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import classnames from 'classnames';
import { chatWrapper, chat, messagesBox, message, input } from './chat.module.css';
import { useMessage, useSocketSend } from '../../utils/socket/Socket';
import type { IncomingMessage } from '../../utils/socket/Socket';
import { scrollbarBox } from '../../uiElements/Scrollbar/scrollbar.module.css';

const lastUserMessages = localStorage.getItem('lastUserMessages');

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
  const [lastMessages, setLastMessages] = useState<Array<string>>(
    lastUserMessages ? JSON.parse(lastUserMessages) : [],
  );
  const [lastMessageindex, setLastMessageindex] = useState(-1);

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
    const element = ref.current;
    if (!element) return;
    const mouseScroll = (event: WheelEvent) => {
      event.preventDefault();
      if (event.deltaY > 0) {
        element.scrollTop += 17;
      } else {
        element.scrollTop -= 17;
      }
    };

    element.addEventListener('wheel', mouseScroll);
    return () => {
      element.removeEventListener('wheel', mouseScroll);
    };
  }, [ref]);
  return (
    <div className={chatWrapper}>
      <div className={chat}>
        <div className={classnames(messagesBox, scrollbarBox)} ref={ref}>
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
            onChange={(event) => {
              setCurrentMessage(event.target.value);
              if (lastMessageindex !== 0) {
                setLastMessageindex(0);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowUp' && lastMessages) {
                const newIndex =
                  lastMessageindex + 1 > lastMessages.length - 1 ? 0 : lastMessageindex + 1;
                setLastMessageindex(newIndex);
                setCurrentMessage(lastMessages[newIndex]);
              }
              if (event.key === 'ArrowDown' && lastMessages) {
                const newIndex =
                  lastMessageindex - 1 < 0 ? lastMessages.length - 1 : lastMessageindex - 1;
                setLastMessageindex(newIndex);
                setCurrentMessage(lastMessages[newIndex]);
              }
            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                if (lastMessages.length >= 20) {
                  lastMessages.pop();
                }
                lastMessages.unshift(currentMessage);
                setLastMessages(lastMessages);
                localStorage.setItem('lastUserMessages', JSON.stringify(lastMessages));

                send(currentMessage);
                setCurrentMessage('');
                setLastMessageindex(0);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
