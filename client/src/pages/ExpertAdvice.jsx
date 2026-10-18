import { useEffect, useState } from 'react';

import {
  UserRound,
  MessageCircle,
  Send,
  CheckCircle2,
  Clock3,
  Sprout,
  Bug,
  Droplets,
  IndianRupee,
  X,
  Star,
  RefreshCw,
  Trash2
} from 'lucide-react';

 const API_URL = `${import.meta.env.VITE_API_URL}/api/expert`;

const experts = [
  {
    name: 'Agriculture Advisory Team',
    specialty: 'Crop Management',
    experience: 'Crop planning & cultivation',
    rating: '4.8',
    icon: Sprout
  },
  {
    name: 'Plant Health Expert',
    specialty: 'Disease & Pest Management',
    experience: 'Crop disease identification',
    rating: '4.9',
    icon: Bug
  },
  {
    name: 'Irrigation Specialist',
    specialty: 'Water & Irrigation',
    experience: 'Water management',
    rating: '4.7',
    icon: Droplets
  },
  {
    name: 'Farm Economics Expert',
    specialty: 'Market & Farm Planning',
    experience: 'Cost & market guidance',
    rating: '4.8',
    icon: IndianRupee
  }
];

export default function ExpertAdvice() {
  const [form, setForm] = useState({
    crop: '',
    category: '',
    urgency: 'Normal',
    question: ''
  });

  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');


  // -----------------------------------------
  // FETCH MY QUESTIONS
  // -----------------------------------------
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');

      if (!token) {
        setError('Please login to view your advisory requests.');
        return;
      }

      const response = await fetch(`${API_URL}/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch advisory requests.'
        );
      }

      setQuestions(data);

    } catch (error) {
      console.error('Fetch expert questions error:', error);

      setError(
        error.message ||
        'Unable to connect to the expert advice server.'
      );

    } finally {
      setLoading(false);
    }
  };


  // -----------------------------------------
  // LOAD QUESTIONS
  // -----------------------------------------
  useEffect(() => {
    fetchQuestions();
  }, []);


  // -----------------------------------------
  // HANDLE FORM
  // -----------------------------------------
  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  // -----------------------------------------
  // SUBMIT QUESTION
  // -----------------------------------------
  const submitQuestion = async e => {
    e.preventDefault();

    setError('');

    if (
      !form.crop ||
      !form.category ||
      !form.question.trim()
    ) {
      setError(
        'Please complete the crop, category and question fields.'
      );
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem('token');

      if (!token) {
        setError('Please login before submitting a question.');
        return;
      }

      const response = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          crop: form.crop,
          category: form.category,
          urgency: form.urgency,
          question: form.question.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to submit question.'
        );
      }

      // Add the new backend record to the top
      setQuestions(prev => [
        data.question,
        ...prev
      ]);

      setForm({
        crop: '',
        category: '',
        urgency: 'Normal',
        question: ''
      });

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
      }, 3500);

    } catch (error) {
      console.error('Submit question error:', error);

      setError(
        error.message ||
        'Unable to submit your question.'
      );

    } finally {
      setSubmitting(false);
    }
  };


  // -----------------------------------------
  // DELETE QUESTION
  // -----------------------------------------
  const deleteQuestion = async id => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this question?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError('');

      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_URL}/${id}`,
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
          data.message || 'Failed to delete question.'
        );
      }

      setQuestions(prev =>
        prev.filter(item => item._id !== id)
      );

      if (selectedQuestion?._id === id) {
        setSelectedQuestion(null);
      }

    } catch (error) {
      console.error('Delete question error:', error);

      setError(
        error.message ||
        'Unable to delete question.'
      );

    } finally {
      setDeletingId(null);
    }
  };


  // -----------------------------------------
  // FORMAT DATE
  // -----------------------------------------
  const formatDate = date => {
    if (!date) {
      return '';
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return '';
    }

    return value.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };


  return (
    <div className="expert-page">

      {/* Header */}
      <header className="feature-header expert-header">

        <div>

          <span className="eyebrow">
            AGRICULTURAL SUPPORT
          </span>

          <h1>
            Expert <em>Advice</em>
          </h1>

          <p>
            Ask farming questions and get practical guidance
            about crops, diseases, irrigation and farm planning.
          </p>

        </div>

        <div className="feature-header-icon">
          <UserRound size={42} />
        </div>

      </header>


      <main className="expert-container">

        {/* Error */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        {/* Success */}
        {submitted && (

          <div className="question-success">

            <CheckCircle2 size={20} />

            <div>

              <strong>
                Question submitted successfully.
              </strong>

              <span>
                Your question has been added to your advisory requests.
              </span>

            </div>

          </div>

        )}


        {/* Ask Expert */}
        <section className="ask-expert-card">

          <div className="expert-section-heading">

            <div className="expert-title-icon">
              <MessageCircle size={21} />
            </div>

            <div>

              <span className="eyebrow">
                ASK AN EXPERT
              </span>

              <h2>
                Describe your <em>farming question</em>
              </h2>

              <p>
                Provide as much information as possible so the
                advice can be more useful.
              </p>

            </div>

          </div>


          <form
            className="expert-form"
            onSubmit={submitQuestion}
          >

            <div className="expert-form-grid">

              {/* Crop */}
              <div className="expert-form-group">

                <label>
                  Crop
                </label>

                <select
                  name="crop"
                  value={form.crop}
                  onChange={handleChange}
                >

                  <option value="">
                    Select crop
                  </option>

                  <option value="Wheat">
                    Wheat
                  </option>

                  <option value="Rice">
                    Rice
                  </option>

                  <option value="Tomato">
                    Tomato
                  </option>

                  <option value="Potato">
                    Potato
                  </option>

                  <option value="Cotton">
                    Cotton
                  </option>

                  <option value="Maize">
                    Maize
                  </option>

                  <option value="Mustard">
                    Mustard
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              {/* Category */}
              <div className="expert-form-group">

                <label>
                  Question Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Crop Management">
                    Crop Management
                  </option>

                  <option value="Disease & Pest">
                    Disease & Pest
                  </option>

                  <option value="Irrigation">
                    Irrigation
                  </option>

                  <option value="Soil & Fertilizer">
                    Soil & Fertilizer
                  </option>

                  <option value="Market & Selling">
                    Market & Selling
                  </option>

                  <option value="Government Schemes">
                    Government Schemes
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              {/* Urgency */}
              <div className="expert-form-group">

                <label>
                  Urgency
                </label>

                <select
                  name="urgency"
                  value={form.urgency}
                  onChange={handleChange}
                >

                  <option value="Normal">
                    Normal
                  </option>

                  <option value="Important">
                    Important
                  </option>

                  <option value="Urgent">
                    Urgent
                  </option>

                </select>

              </div>

            </div>


            {/* Question */}
            <div className="expert-form-group question-field">

              <label>
                Your Question
              </label>

              <textarea
                name="question"
                value={form.question}
                onChange={handleChange}
                placeholder="Example: My wheat leaves are turning yellow. What could be the reason?"
                rows="5"
              />

            </div>


            <div className="expert-form-bottom">

              <span>

                <CheckCircle2 size={14} />

                Avoid sharing sensitive personal information.

              </span>


              <button
                type="submit"
                className="btn btn-primary expert-submit"
                disabled={submitting}
              >

                {submitting ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="expert-spin"
                    />

                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />

                    Submit Question
                  </>
                )}

              </button>

            </div>

          </form>

        </section>


        {/* Experts */}
        <section className="experts-section">

          <div className="expert-list-heading">

            <div>

              <span className="eyebrow">
                OUR EXPERTISE
              </span>

              <h2>
                Agricultural <em>Experts</em>
              </h2>

            </div>

            <p>
              Get guidance across different areas of farming.
            </p>

          </div>


          <div className="experts-grid">

            {experts.map(expert => {

              const Icon = expert.icon;

              return (

                <article
                  className="expert-card"
                  key={expert.name}
                >

                  <div className="expert-card-top">

                    <div className="expert-avatar">
                      <Icon size={23} />
                    </div>

                    <span className="expert-rating">

                      <Star size={12} />

                      {expert.rating}

                    </span>

                  </div>


                  <h3>
                    {expert.name}
                  </h3>


                  <span className="expert-specialty">
                    {expert.specialty}
                  </span>


                  <p>
                    {expert.experience}
                  </p>


                  <div className="expert-available">

                    <span></span>

                    Advisory available

                  </div>

                </article>

              );

            })}

          </div>

        </section>


        {/* My Questions */}
        <section className="my-questions-section">

          <div className="expert-list-heading">

            <div>

              <span className="eyebrow">
                MY ADVISORY REQUESTS
              </span>

              <h2>
                Your <em>Questions</em>
              </h2>

            </div>

            <span className="question-count">
              {questions.length} requests
            </span>

          </div>


          {loading ? (

            <div className="questions-list">

              <div className="question-card">

                <div className="question-icon">
                  <RefreshCw
                    size={19}
                    className="expert-spin"
                  />
                </div>

                <div className="question-content">

                  <h3>
                    Loading your questions...
                  </h3>

                  <p>
                    Fetching your advisory requests.
                  </p>

                </div>

              </div>

            </div>

          ) : questions.length > 0 ? (

            <div className="questions-list">

              {questions.map(item => (

                <article
                  className="question-card"
                  key={item._id}
                >

                  <div className="question-icon">
                    <MessageCircle size={19} />
                  </div>


                  <div className="question-content">

                    <div className="question-meta">

                      <span>
                        {item.crop}
                      </span>

                      <span>
                        {item.category}
                      </span>

                      <small>
                        {formatDate(item.createdAt)}
                      </small>

                    </div>


                    <h3>
                      {item.question}
                    </h3>


                    {item.answer && (

                      <p>
                        <strong>
                          Advice:
                        </strong>{' '}
                        {item.answer}
                      </p>

                    )}

                  </div>


                  <div
                    className={`question-status ${
                      item.status === 'Answered'
                        ? 'answered'
                        : 'review'
                    }`}
                  >

                    {item.status === 'Answered' ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Clock3 size={14} />
                    )}

                    {item.status}

                  </div>


                  <button
                    className="question-view-btn"
                    type="button"
                    onClick={() =>
                      setSelectedQuestion(item)
                    }
                  >
                    View
                  </button>


                  <button
                    className="question-delete-btn"
                    type="button"
                    onClick={() =>
                      deleteQuestion(item._id)
                    }
                    disabled={deletingId === item._id}
                    title="Delete question"
                  >

                    {deletingId === item._id ? (
                      <RefreshCw
                        size={15}
                        className="expert-spin"
                      />
                    ) : (
                      <Trash2 size={15} />
                    )}

                  </button>

                </article>

              ))}

            </div>

          ) : (

            <div className="questions-list">

              <div className="question-card">

                <div className="question-icon">
                  <MessageCircle size={19} />
                </div>

                <div className="question-content">

                  <h3>
                    No advisory requests yet
                  </h3>

                  <p>
                    Submit your first farming question above.
                  </p>

                </div>

              </div>

            </div>

          )}

        </section>


        {/* Disclaimer */}
        <div className="expert-disclaimer">

          <strong>
            Important:
          </strong>{' '}
          Expert advice should be used
          as agricultural guidance. For serious crop damage,
          pesticide use or other high-impact decisions, verify
          recommendations with a qualified local agricultural
          professional and follow applicable product labels and
          government guidance.

        </div>

      </main>


      {/* Question Modal */}
      {selectedQuestion && (

        <div
          className="question-modal-overlay"
          onClick={() =>
            setSelectedQuestion(null)
          }
        >

          <div
            className="question-modal"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <button
              className="question-modal-close"
              type="button"
              onClick={() =>
                setSelectedQuestion(null)
              }
            >
              <X size={18} />
            </button>


            <div className="question-modal-icon">
              <MessageCircle size={23} />
            </div>


            <span className="eyebrow">
              {selectedQuestion.category}
            </span>


            <h2>
              {selectedQuestion.crop} Question
            </h2>


            <p className="modal-question">
              {selectedQuestion.question}
            </p>


            <div className="modal-status">

              {selectedQuestion.status === 'Answered' ? (
                <>
                  <CheckCircle2 size={17} />
                  <span>Answered</span>
                </>
              ) : (
                <>
                  <Clock3 size={17} />
                  <span>
                    {selectedQuestion.status}
                  </span>
                </>
              )}

            </div>


            {selectedQuestion.answer ? (

              <div className="modal-answer">

                <span className="eyebrow">
                  EXPERT ADVICE
                </span>

                <p>
                  {selectedQuestion.answer}
                </p>

              </div>

            ) : (

              <div className="modal-pending">

                <Clock3 size={18} />

                <p>
                  Your question is currently under review.
                  Advice will appear here when available.
                </p>

              </div>

            )}


          </div>

        </div>

      )}

    </div>
  );
}
