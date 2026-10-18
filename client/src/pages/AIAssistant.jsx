import { useEffect, useState } from 'react';

import {
  Bot,
  Send,
  Sprout,
  CloudSun,
  Bug,
  Droplets,
  IndianRupee,
  Trash2,
  UserRound,
  Sparkles
} from 'lucide-react';

const quickQuestions = [
  {
    text: 'How often should I irrigate wheat?',
    icon: Droplets
  },
  {
    text: 'Why are my tomato leaves turning yellow?',
    icon: Bug
  },
  {
    text: 'Which crop is suitable for this season?',
    icon: Sprout
  },
  {
    text: 'How can I improve my crop yield?',
    icon: Sparkles
  }
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState('');

  const [typing, setTyping] = useState(false);

  const [loadingHistory, setLoadingHistory] = useState(true);

  const [error, setError] = useState('');

  // =========================================
  // GET TOKEN
  // =========================================

  const getToken = () => {
    return localStorage.getItem('token');
  };


  // =========================================
  // DEFAULT MESSAGE
  // =========================================

  const defaultMessage = {
    id: 'welcome',
    type: 'bot',
    text:
      'Hello! I am the Kisan Setu Farming Assistant. Ask me about crops, irrigation, soil, weather, diseases, pests, markets or general farming practices.'
  };


  // =========================================
  // LOAD CHAT HISTORY
  // =========================================

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      setError('');

      const token = getToken();

      if (!token) {
        setMessages([defaultMessage]);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load AI chat history.'
        );
      }

      /*
        The backend may return:

        {
          messages: [...]
        }

        or:

        {
          conversation: {
            messages: [...]
          }
        }

        This handles both.
      */

      const historyMessages =
        data?.messages ||
        data?.conversation?.messages ||
        data?.history ||
        [];

      if (!Array.isArray(historyMessages) || historyMessages.length === 0) {
        setMessages([defaultMessage]);
        return;
      }

      const formattedMessages = historyMessages.map(
        (message, index) => ({
          id: message._id || `${message.role}-${index}-${Date.now()}`,
          type:
            message.role === 'user'
              ? 'user'
              : 'bot',
          text: message.content || ''
        })
      );

      setMessages(formattedMessages);

    } catch (err) {
      console.error('AI history error:', err);

      setError(err.message);

      setMessages([defaultMessage]);

    } finally {
      setLoadingHistory(false);
    }
  };


  // =========================================
  // LOAD HISTORY ON PAGE OPEN
  // =========================================

  useEffect(() => {
    loadHistory();
  }, []);


  // =========================================
  // SEND MESSAGE
  // =========================================

  const sendMessage = async (message) => {
    const text = message.trim();

    if (!text || typing) {
      return;
    }

    try {
      setError('');

      const token = getToken();

      if (!token) {
        setError('Please login again to use the AI assistant.');
        return;
      }

      // Immediately show user's message
      const userMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        text
      };

      setMessages((prev) => [
        ...prev,
        userMessage
      ]);

      setInput('');

      setTyping(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/chat`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            message: text
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to get AI response.'
        );
      }

      /*
        Handle possible backend response formats.

        Example:
        {
          reply: "...."
        }

        or:
        {
          message: {
            role: "assistant",
            content: "...."
          }
        }

        or:
        {
          assistantMessage: "...."
        }
      */

      const assistantText =
        data?.reply ||
        data?.response ||
        data?.answer ||
        data?.assistantMessage?.content ||
        data?.message?.content ||
        data?.conversation?.messages?.[
          data.conversation.messages.length - 1
        ]?.content ||
        'I could not generate a response. Please try again.';

      const botMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        text: assistantText
      };

      setMessages((prev) => [
        ...prev,
        botMessage
      ]);

    } catch (err) {
      console.error('AI chat error:', err);

      setError(err.message);

      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'bot',
        text:
          'Sorry, I could not connect to the farming assistant right now. Please try again.'
      };

      setMessages((prev) => [
        ...prev,
        errorMessage
      ]);

    } finally {
      setTyping(false);
    }
  };


  // =========================================
  // FORM SUBMIT
  // =========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    sendMessage(input);
  };


  // =========================================
  // CLEAR CHAT
  // =========================================

  const clearChat = async () => {
    try {
      setError('');

      const token = getToken();

      if (!token) {
        setMessages([defaultMessage]);
        return;
      }

      setTyping(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/history`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to clear chat.'
        );
      }

      setMessages([
        {
          id: `welcome-${Date.now()}`,
          type: 'bot',
          text:
            'Chat cleared. How can I help you with your farming question?'
        }
      ]);

      setInput('');

    } catch (err) {
      console.error('Clear AI history error:', err);

      setError(err.message);

    } finally {
      setTyping(false);
    }
  };


  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="ai-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="feature-header ai-header">

        <div>

          <span className="eyebrow">
            SMART FARMING ASSISTANT
          </span>

          <h1>
            AI Farming <em>Assistant</em>
          </h1>

          <p>
            Get quick farming guidance through a simple,
            farmer-friendly conversation.
          </p>

        </div>

        <div className="feature-header-icon">
          <Bot size={42} />
        </div>

      </header>


      {/* =====================================
          MAIN AI AREA
      ===================================== */}

      <main className="ai-container">

        {/* ===================================
            CHAT
        =================================== */}

        <section className="ai-chat-card">

          {/* CHAT HEADER */}

          <div className="ai-chat-header">

            <div className="ai-profile">

              <div className="ai-avatar">
                <Bot size={23} />
              </div>

              <div>

                <strong>
                  Kisan Setu Assistant
                </strong>

                <span>
                  <i></i>
                  Farming guidance assistant
                </span>

              </div>

            </div>


            <button
              className="clear-chat-btn"
              onClick={clearChat}
              type="button"
              disabled={typing}
            >
              <Trash2 size={15} />
              Clear
            </button>

          </div>


          {/* ERROR */}

          {error && (
            <div className="ai-error">
              {error}
            </div>
          )}


          {/* =================================
              MESSAGES
          ================================= */}

          <div className="ai-messages">

            {loadingHistory ? (

              <div className="ai-loading-history">
                <div className="ai-loading-spinner"></div>

                <span>
                  Loading your conversation...
                </span>
              </div>

            ) : (

              messages.map((message) => (

                <div
                  key={message.id}
                  className={`ai-message-row ${
                    message.type === 'user'
                      ? 'user-message'
                      : 'bot-message'
                  }`}
                >

                  {/* BOT AVATAR */}

                  {message.type === 'bot' && (

                    <div className="message-avatar bot-avatar">
                      <Bot size={16} />
                    </div>

                  )}


                  {/* MESSAGE */}

                  <div className="ai-message">

                    <p>
                      {message.text}
                    </p>

                    <span className="message-time">

                      {message.type === 'bot'
                        ? 'Kisan Setu Assistant'
                        : 'You'}

                    </span>

                  </div>


                  {/* USER AVATAR */}

                  {message.type === 'user' && (

                    <div className="message-avatar user-avatar">
                      <UserRound size={16} />
                    </div>

                  )}

                </div>

              ))

            )}


            {/* TYPING */}

            {typing && (

              <div className="ai-message-row bot-message">

                <div className="message-avatar bot-avatar">
                  <Bot size={16} />
                </div>

                <div className="ai-message typing-message">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

            )}

          </div>


          {/* =================================
              QUICK QUESTIONS
          ================================= */}

          <div className="quick-question-section">

            <span>
              QUICK QUESTIONS
            </span>

            <div className="quick-question-list">

              {quickQuestions.map((question) => {

                const Icon = question.icon;

                return (

                  <button
                    key={question.text}
                    type="button"
                    onClick={() =>
                      sendMessage(question.text)
                    }
                    disabled={
                      typing ||
                      loadingHistory
                    }
                  >

                    <Icon size={14} />

                    {question.text}

                  </button>

                );

              })}

            </div>

          </div>


          {/* =================================
              INPUT
          ================================= */}

          <form
            className="ai-input-area"
            onSubmit={handleSubmit}
          >

            <div className="ai-input">

              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                placeholder="Ask your farming question..."
                disabled={
                  typing ||
                  loadingHistory
                }
              />

            </div>


            <button
              type="submit"
              className="ai-send-btn"
              disabled={
                !input.trim() ||
                typing ||
                loadingHistory
              }
            >

              <Send size={18} />

            </button>

          </form>


          {/* =================================
              DISCLAIMER
          ================================= */}

          <div className="ai-disclaimer">

            <Sparkles size={12} />

            AI-generated guidance may not always be
            accurate. Verify important crop, pesticide
            and financial decisions with qualified
            agricultural professionals and official
            sources.

          </div>

        </section>


        {/* =====================================
            SIDE INFORMATION
        ===================================== */}

        <aside className="ai-side">

          <div className="ai-side-card">

            <div className="ai-side-icon">
              <Sprout size={21} />
            </div>

            <h3>
              What can I ask?
            </h3>

            <ul>

              <li>
                <Sprout size={14} />
                Crop selection
              </li>

              <li>
                <Droplets size={14} />
                Irrigation
              </li>

              <li>
                <Bug size={14} />
                Diseases & pests
              </li>

              <li>
                <CloudSun size={14} />
                Weather & farming
              </li>

              <li>
                <IndianRupee size={14} />
                Market & farm planning
              </li>

            </ul>

          </div>


          <div className="ai-side-card ai-tip-card">

            <div className="ai-side-icon">
              <Sparkles size={21} />
            </div>

            <span className="eyebrow">
              TIP
            </span>

            <h3>
              Give more details for better guidance.
            </h3>

            <p>
              Mention your crop, growth stage,
              symptoms, soil condition and recent
              weather whenever relevant.
            </p>

          </div>

        </aside>

      </main>

    </div>
  );
}