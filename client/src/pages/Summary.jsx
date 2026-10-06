import React, { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/contract`;

const Summary = () => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH CONTRACT
  // =========================================================

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const contractId = sessionStorage.getItem("contractId");

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
      } catch (err) {
        console.error("Summary fetch error:", err);

        setError(
          err.message || "Failed to load contract summary."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, []);

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

          <p className="mt-4 text-sm text-gray-600">
            Loading contract summary...
          </p>

        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR SCREEN
  // =========================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">

          <div className="text-4xl">
            ⚠️
          </div>

          <h2 className="mt-3 text-lg font-semibold text-gray-900">
            Unable to load summary
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() => window.history.back()}
            className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            ← Go Back
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // CONTRACT DATA
  // =========================================================

  const sections = contract?.sections || [];

  // =========================================================
  // FIND SECTION
  // =========================================================

  const getSection = (...titles) => {
    return sections.find((section) =>
      titles.some(
        (title) =>
          section.title?.toLowerCase() ===
          title.toLowerCase()
      )
    );
  };

  const parties = getSection(
    "Parties"
  );

  const effectiveDate = getSection(
    "Effective Date"
  );

  const expiry = getSection(
    "Expiry / Contract Term",
    "Expiry Date",
    "Expiry",
    "Contract Term"
  );

  const renewal = getSection(
    "Renewal",
    "Renewal Clause"
  );

  const termination = getSection(
    "Termination",
    "Termination Clause"
  );

  const noticePeriod = getSection(
    "Notice Period"
  );

  const obligations = getSection(
    "Obligations",
    "Key Obligations"
  );

  const deadlines = getSection(
    "Deadlines"
  );

  const responsibleParties = getSection(
    "Responsible Parties",
    "Responsible Party"
  );

  // =========================================================
  // FORMAT CONTENT
  // =========================================================

  const displayContent = (section) => {
    if (!section) {
      return "Information not available.";
    }

    if (
      section.content === null ||
      section.content === undefined ||
      section.content === ""
    ) {
      return "Information not available.";
    }

    if (typeof section.content === "string") {
      return section.content;
    }

    if (Array.isArray(section.content)) {
      return section.content
        .map((item) => {
          if (typeof item === "string") {
            return `• ${item}`;
          }

          return `• ${JSON.stringify(item)}`;
        })
        .join("\n");
    }

    if (typeof section.content === "object") {
      return Object.entries(section.content)
        .map(([key, value]) => {
          const formattedKey =
            key.charAt(0).toUpperCase() +
            key.slice(1);

          return `${formattedKey}: ${
            typeof value === "object"
              ? JSON.stringify(value)
              : value
          }`;
        })
        .join("\n");
    }

    return String(section.content);
  };

  // =========================================================
  // INFORMATION CARD
  // =========================================================

  const InformationCard = ({
    title,
    section,
    fullWidth = false,
  }) => {
    return (
      <div
        className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${
          fullWidth ? "md:col-span-2" : ""
        }`}
      >

        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>

        <div className="mt-4 rounded-lg bg-gray-50 p-4">

          <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
            {displayContent(section)}
          </p>

        </div>

      </div>
    );
  };

  // =========================================================
  // PRINT SUMMARY
  // =========================================================

  const handlePrint = () => {
    window.print();
  };

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Reviewed Contract Summary
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Important information extracted from the contract.
            </p>

          </div>

          <button
            onClick={() => window.history.back()}
            className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            ← Back
          </button>

        </div>

        {/* =====================================================
            CONTRACT HEADER
        ===================================================== */}

        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Contract
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                {contract?.fileName || "Contract"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {contract?.fileType || "Contract document"}
              </p>

            </div>

            <div className="rounded-lg bg-indigo-50 px-4 py-3">

              <p className="text-xs font-medium text-indigo-500">
                Contract ID
              </p>

              <p className="mt-1 max-w-[250px] truncate text-sm font-medium text-indigo-700">
                {contract?._id}
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            MAIN CONTRACT INFORMATION
        ===================================================== */}

        <div className="mb-8">

          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Contract Information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Parties */}

            <InformationCard
              title="Parties"
              section={parties}
            />

            {/* Effective Date */}

            <InformationCard
              title="Effective Date"
              section={effectiveDate}
            />

            {/* Expiry */}

            <InformationCard
              title="Expiry / Contract Term"
              section={expiry}
            />

            {/* Renewal */}

            <InformationCard
              title="Renewal"
              section={renewal}
            />

            {/* Termination */}

            <InformationCard
              title="Termination"
              section={termination}
            />

            {/* Notice Period */}

            <InformationCard
              title="Notice Period"
              section={noticePeriod}
            />

            {/* Obligations */}

            <InformationCard
              title="Key Obligations"
              section={obligations}
              fullWidth
            />

            {/* Deadlines */}

            <InformationCard
              title="Deadlines"
              section={deadlines}
            />

            {/* Responsible Parties */}

            <InformationCard
              title="Responsible Parties"
              section={responsibleParties}
            />

          </div>

        </div>

        {/* =====================================================
            UPCOMING OBLIGATIONS
        ===================================================== */}

        <div className="mb-8">

          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Upcoming Obligations & Renewal Deadlines
          </h2>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">

              <div className="text-3xl">
                📅
              </div>

              <h3 className="mt-3 text-base font-semibold text-gray-800">
                Deadline information
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
                Upcoming obligations, renewal deadlines,
                and reminder dates will appear here after
                the deterministic deadline calculation is
                connected.
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            ACTION BUTTONS
        ===================================================== */}

        <div className="flex flex-col gap-3 border-t border-gray-200 py-6 sm:flex-row sm:justify-end">

          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            ← Back to Review
          </button>

          <button
            onClick={handlePrint}
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            🖨 Print Summary
          </button>

        </div>

      </div>

    </div>
  );
};

export default Summary;