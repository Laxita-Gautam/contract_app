import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";


// ======================================================
// HOME PAGE
// ======================================================

function HomePage() {
  const navigate = useNavigate();

  const [inputMode, setInputMode] = useState("file");

  const [file, setFile] = useState(null);
  const [contractText, setContractText] = useState("");
  const [policyFile, setPolicyFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -------------------------------
  // Contract file
  // -------------------------------

  function handleContractFile(e) {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();

    if (
      !fileName.endsWith(".pdf") &&
      !fileName.endsWith(".docx")
    ) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }

    setFile(selectedFile);
    setError("");
  }

  // -------------------------------
  // Policy file
  // -------------------------------

  function handlePolicyFile(e) {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();

    if (
      !fileName.endsWith(".pdf") &&
      !fileName.endsWith(".docx")
    ) {
      setError("Policy must be a PDF or DOCX file.");
      return;
    }

    setPolicyFile(selectedFile);
    setError("");
  }

  // -------------------------------
  // Submit
  // -------------------------------

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (inputMode === "file" && !file) {
      setError("Please select a contract file.");
      return;
    }

    if (
      inputMode === "text" &&
      !contractText.trim()
    ) {
      setError("Please enter the contract text.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      if (inputMode === "file" && file) {
        formData.append("contract", file);
      }

      if (inputMode === "text") {
        formData.append(
          "contractText",
          contractText
        );
      }

      if (policyFile) {
        formData.append("policy", policyFile);
      }

      // --------------------------------
      // Backend API
      // --------------------------------

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contract/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(
      //     data.message ||
      //       "Failed to analyze contract."
      //   );
      // }

      // setSuccess(
      //   "Contract analyzed successfully."
      // );

      // // Go to review page
      // navigate("/review");
      const data = await response.json();

if (!response.ok) {
  throw new Error(
    data.message ||
      "Failed to analyze contract."
  );
}

// Save backend response
// sessionStorage.setItem(
//   "contractAnalysis",
//   JSON.stringify(data)
// );
sessionStorage.setItem(
  "contractId",
  data.contractId
);

navigate("/review");
setSuccess(
  "Contract analyzed successfully."
);

// Go to review page
navigate("/review");

    } catch (err) {
      setError(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}

      <header className="border-b bg-white">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              📄
            </div>

            <span className="text-lg font-bold text-gray-900">
              Contract Management Assistant
            </span>

          </Link>

          
        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-4xl px-6 py-12">

        {/* Heading */}

        <div className="mb-8">

          <p className="text-sm font-medium text-blue-600">
            Contract Management Assistant
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Analyze a Contract
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Upload a contract or paste its text to
            extract parties, dates, obligations,
            renewal terms, and other important
            contract information.
          </p>

        </div>

        {/* ================= DISCLAIMER ================= */}

        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">

          <p className="text-sm text-yellow-800">

            <strong>
              Information-management tool:
            </strong>{" "}

            This application extracts and organizes
            information from contracts. It does not
            provide legal advice.

          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ================= CONTRACT ================= */}

          <section className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
              Contract
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Provide the contract as a PDF, DOCX,
              or pasted text.
            </p>

            {/* Tabs */}

            <div className="mt-5 flex gap-2 rounded-lg bg-gray-100 p-1">

              <button
                type="button"
                onClick={() => {
                  setInputMode("file");
                  setError("");
                }}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
                  inputMode === "file"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Upload File
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputMode("text");
                  setError("");
                }}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
                  inputMode === "text"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Paste Text
              </button>

            </div>

            {/* File */}

            {inputMode === "file" && (

              <div className="mt-5">

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-10 text-center hover:border-blue-400">

                  <div className="text-4xl">
                    📄
                  </div>

                  <p className="mt-3 font-medium text-gray-900">

                    {file
                      ? file.name
                      : "Choose a contract file"}

                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    PDF or DOCX
                  </p>

                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleContractFile}
                  />

                </label>

                {file && (

                  <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 p-3">

                    <div>

                      <p className="text-sm font-medium">
                        {file.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>

                  </div>

                )}

              </div>

            )}

            {/* Text */}

            {inputMode === "text" && (

              <div className="mt-5">

                <textarea
                  value={contractText}
                  onChange={(e) => {
                    setContractText(
                      e.target.value
                    );
                    setError("");
                  }}
                  placeholder="Paste the contract text here..."
                  rows={16}
                  className="w-full rounded-xl border border-gray-300 p-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <div className="mt-2 text-right text-xs text-gray-500">
                  {contractText.length.toLocaleString()}{" "}
                  characters
                </div>

              </div>

            )}

          </section>

          {/* ================= POLICY ================= */}

          <section className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
              Organization Policy{" "}
              <span className="text-sm font-normal text-gray-400">
                Optional
              </span>
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Upload a small policy document to
              identify conflicts or additional
              requirements.
            </p>

            <div className="mt-4">

              <label className="flex cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed border-gray-300 p-5 hover:border-blue-400">

                <div className="text-2xl">
                  📎
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium">
                    {policyFile
                      ? policyFile.name
                      : "Choose policy document"}
                  </p>

                  <p className="text-xs text-gray-500">
                    PDF or DOCX
                  </p>

                </div>

                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handlePolicyFile}
                />

              </label>

              {policyFile && (

                <button
                  type="button"
                  onClick={() =>
                    setPolicyFile(null)
                  }
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Remove policy
                </button>

              )}

            </div>

          </section>

          {/* ================= ERROR ================= */}

          {error && (

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">

              <p className="text-sm text-red-700">
                ⚠️ {error}
              </p>

            </div>

          )}

          {/* ================= SUCCESS ================= */}

          {success && (

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">

              <p className="text-sm text-green-700">
                ✓ {success}
              </p>

            </div>

          )}

          {/* ================= BUTTON ================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >

            {loading
              ? "Analyzing Contract..."
              : "Analyze Contract"}

          </button>

       


        </form>

      </main>

    </div>
  );
}
export default HomePage

