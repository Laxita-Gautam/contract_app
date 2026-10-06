import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/contract`;

const ReviewAndEdit = () => {
  const [contract, setContract] = useState(null);
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // ======================================================
  // FETCH CONTRACT FROM BACKEND
  // ======================================================

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        setError("");

        const contractId =
          sessionStorage.getItem("contractId");

        if (!contractId) {
          setError(
            "No contract found. Please upload a contract first."
          );
          return;
        }

        const response = await fetch(
          `${API_URL}/${contractId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load contract."
          );
        }

        setContract(data);
        setSections(data.sections || []);
      } catch (err) {
        console.error("Fetch contract error:", err);

        setError(
          err.message || "Failed to load contract."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, []);

  // ======================================================
  // EDIT SECTION LOCALLY
  // ======================================================

  const handleEdit = (id, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id
          ? {
            ...section,
            content: value,
            status: "pending",
          }
          : section
      )
    );

    setSuccess("");
  };

  // ======================================================
  // APPROVE SECTION
  // ======================================================

  const handleApprove = (id) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id
          ? {
            ...section,
            status: "approved",
          }
          : section
      )
    );

    setSuccess("");
  };

  // ======================================================
  // REJECT SECTION
  // ======================================================

  const handleReject = (id) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id
          ? {
            ...section,
            status: "rejected",
          }
          : section
      )
    );

    setSuccess("");
  };

  // ======================================================
  // SAVE ALL CHANGES
  // ======================================================

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const contractId =
        sessionStorage.getItem("contractId");

      if (!contractId) {
        throw new Error("Contract ID not found.");
      }

      // Save every section
      for (const section of sections) {
        const response = await fetch(
          `${API_URL}/${contractId}/sections/${section.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: section.content,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            `Failed to save section ${section.id}`
          );
        }
      }

      setSuccess("Changes saved successfully.");
    } catch (err) {
      console.error("Save changes error:", err);

      setError(
        err.message || "Failed to save changes."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // STATUS COUNTS
  // ======================================================

  const approvedCount = sections.filter(
    (section) => section.status === "approved"
  ).length;

  const rejectedCount = sections.filter(
    (section) => section.status === "rejected"
  ).length;

  const pendingCount = sections.filter(
    (section) => section.status === "pending"
  ).length;

  // ======================================================
  // FINAL APPROVAL
  // ======================================================

  const handleFinalApproval = () => {
    if (sections.length === 0) {
      alert("No contract sections found.");
      return;
    }

    if (pendingCount > 0) {
      alert(
        "Please review all sections before approving the contract."
      );
      return;
    }

    if (rejectedCount > 0) {
      alert(
        "Please resolve the rejected sections before final approval."
      );
      return;
    }

    alert("Contract approved successfully!");
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

          <p className="mt-4 text-sm text-gray-600">
            Loading contract...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error && !contract) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <div className="text-4xl">⚠️</div>

          <h2 className="mt-3 text-lg font-semibold text-gray-900">
            Unable to load contract
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() => window.history.back()}
            className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Review & Edit Contract
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Review the sections extracted from your contract.
              Edit, approve, or reject each section.
            </p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            ← Back
          </button>
        </div>

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-700">
              ✓ {success}
            </p>
          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && contract && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* ==================================================
            CONTRACT INFORMATION
        ================================================== */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            {/* File information */}

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {contract?.fileName || "Contract"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                AI Extracted Contract
              </p>
            </div>

            {/* Status summary */}

            <div className="grid grid-cols-3 gap-3 sm:gap-4">

              <div className="rounded-lg bg-green-50 px-4 py-3 text-center">
                <p className="text-xl font-bold text-green-700">
                  {approvedCount}
                </p>

                <p className="text-xs text-green-600">
                  Approved
                </p>
              </div>

              <div className="rounded-lg bg-yellow-50 px-4 py-3 text-center">
                <p className="text-xl font-bold text-yellow-700">
                  {pendingCount}
                </p>

                <p className="text-xs text-yellow-600">
                  Pending
                </p>
              </div>

              <div className="rounded-lg bg-red-50 px-4 py-3 text-center">
                <p className="text-xl font-bold text-red-700">
                  {rejectedCount}
                </p>

                <p className="text-xs text-red-600">
                  Rejected
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ==================================================
            CONTRACT SECTIONS
        ================================================== */}

        <div className="space-y-5">

          {sections.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                No sections were extracted from this contract.
              </p>
            </div>
          ) : (
            sections.map((section) => (

              <div
                key={section.id}
                className={`rounded-xl border bg-white p-5 shadow-sm transition ${section.status === "approved"
                    ? "border-l-4 border-l-green-500"
                    : section.status === "rejected"
                      ? "border-l-4 border-l-red-500"
                      : "border-l-4 border-l-yellow-500"
                  }`}
              >

                {/* Section Header */}

                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-3">

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                      {section.id}
                    </span>

                    <h3 className="text-base font-semibold text-gray-900">
                      {section.title}
                    </h3>

                  </div>

                  {/* Status */}

                  {section.status === "approved" && (
                    <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      ✓ Approved
                    </span>
                  )}

                  {section.status === "rejected" && (
                    <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      ✕ Rejected
                    </span>
                  )}

                  {section.status === "pending" && (
                    <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      ● Pending Review
                    </span>
                  )}

                </div>

                {/* Editable Content */}

                <textarea
                  value={
                    section.content === null ||
                      section.content === undefined
                      ? ""
                      : typeof section.content === "string"
                        ? section.content
                        : JSON.stringify(
                          section.content,
                          null,
                          2
                        )
                  }
                  onChange={(e) =>
                    handleEdit(
                      section.id,
                      e.target.value
                    )
                  }
                  className="min-h-[110px] w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm leading-6 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />

                {/* Section Actions */}

                <div className="mt-4 flex flex-wrap gap-3">

                  <button
                    onClick={() =>
                      handleApprove(section.id)
                    }
                    disabled={
                      section.status === "approved"
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ✓ Approve
                  </button>

                  <button
                    onClick={() =>
                      handleReject(section.id)
                    }
                    disabled={
                      section.status === "rejected"
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ✕ Reject
                  </button>

                </div>

              </div>

            ))
          )}

        </div>

        {/* ==================================================
            BOTTOM ACTIONS
        ================================================== */}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 py-6 sm:flex-row sm:justify-end">

          <button
            onClick={handleSaveChanges}
            disabled={saving || sections.length === 0}
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <button
            onClick={handleFinalApproval}
            disabled={
              sections.length === 0 ||
              pendingCount > 0 ||
              rejectedCount > 0
            }
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✓ Approve Contract
          </button>
          <button
            onClick={() => navigate("/summary")}
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            View Summary →
          </button>

        </div>

      </div>
    </div>
  );
};

export default ReviewAndEdit;