import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../features/authSlice";

import "../../components/ui/styles/button.css";
import "../../components/ui/styles/card.css";
import "../../components/ui/styles/input.css";
import "./profile.css";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user) || {};

  const initialForm = useMemo(
    () => ({
      name: user?.name ?? "",
      email: user?.email ?? "",
      pin: "",
    }),
    [user?.email, user?.name]
  );

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(form));
  };

  return (
    <div className="profile-view">
      <header className="profile-view__header">
        <div>
          <h1 className="profile-view__title">Profile</h1>
          <p className="profile-view__subtitle text-muted">
            Update your personal details.
          </p>
        </div>
      </header>

      <section className="card profile-view__card">
        <div className="card__head">
          <h2 className="card__title">Personal Info</h2>
          <span className="pill">Secure</span>
        </div>

        <form className="profile-view__form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              className="form-input"
              name="name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              className="form-input"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pin" className="form-label">
              Reset Pin
            </label>
            <input
              id="pin"
              className="form-input"
              name="pin"
              type="password"
              value={form.pin ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, pin: e.target.value }))}
              autoComplete="new-password"
            />
          </div>
          <div className="profile-view__actions">
            <button className="btn btn--primary" type="submit">
              Save
            </button>
            <button
              className="btn btn--outline"
              type="button"
              onClick={() => setForm(initialForm)}
            >
              Reset
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
