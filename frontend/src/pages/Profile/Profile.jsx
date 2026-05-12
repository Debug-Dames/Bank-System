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
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? user?.phone ?? "",
    }),
    [user?.email, user?.firstName, user?.lastName, user?.phoneNumber, user?.phone]
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
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              id="firstName"
              className="form-input"
              name="firstName"
              value={form.firstName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, firstName: e.target.value }))
              }
              autoComplete="given-name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              id="lastName"
              className="form-input"
              name="lastName"
              value={form.lastName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, lastName: e.target.value }))
              }
              autoComplete="family-name"
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
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              className="form-input"
              name="phoneNumber"
              type="tel"
              value={form.phoneNumber ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
              }
              autoComplete="tel"
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
