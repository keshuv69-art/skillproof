"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

type Skill = {
  id: string;
  name: string;
};

export function AddSkillCard({ userId }: { userId: string }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillId, setSkillId] = useState("");
  const [level, setLevel] = useState("Beginner");

  // FILE
  const [file, setFile] = useState<File | null>(null);

  // PROOF
  const [proofUrl, setProofUrl] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [proofDescription, setProofDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("id, name")
        .order("name");

      if (error) {
        console.error(
          "SKILLS FETCH ERROR:",
          JSON.stringify(error, null, 2)
        );
      }

      if (data) setSkills(data);
    };

    fetchSkills();
  }, []);

  // FILE UPLOAD
  const handleFileUpload = async (selectedFile: File) => {
    try {
      setUploading(true);

      const fileExt = selectedFile.name.split(".").pop();

      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      const filePath = `proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("proofs")
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error(
          "UPLOAD ERROR:",
          JSON.stringify(uploadError, null, 2)
        );

        alert("File upload failed.");
        return;
      }

      const { data } = supabase.storage
        .from("proofs")
        .getPublicUrl(filePath);

      setProofUrl(data.publicUrl);

      alert("Proof uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong uploading file.");
    } finally {
      setUploading(false);
    }
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!skillId) {
      alert("Select a skill first");
      return;
    }

    if (!proofUrl && !proofLink) {
      alert("Please upload proof or provide a portfolio link.");
      return;
    }

    setLoading(true);

    const finalProof =
      proofLink.trim() !== "" ? proofLink : proofUrl;

    const { error } = await supabase.from("user_skills").insert({
  user_id: userId,
  skill_id: skillId,
  level,
  proof_url: finalProof,
  proof_description: proofDescription,
  status: "pending",
});

    if (error) {
      console.error("INSERT ERROR:", JSON.stringify(error, null, 2));
      alert("Insert failed. Check console.");
    } else {
      alert("Skill submitted for verification!");
      window.location.reload();
    }

    setLoading(false);
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-6 hover:border-indigo-500/40 transition-all duration-300">

      <h3 className="text-lg font-semibold text-white mb-2">
        Add a New Skill
      </h3>

      <p className="text-sm text-zinc-500 mb-6">
        Showcase your work using uploads, videos, reels, portfolios,
        or public proof links.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* SKILL */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Skill
          </label>

          <select
            value={skillId}
            onChange={(e) => setSkillId(e.target.value)}
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">
              Choose skill
            </option>

            {skills.map((skill) => (
              <option
                key={skill.id}
                value={skill.id}
              >
                {skill.name}
              </option>
            ))}
          </select>
        </div>

        {/* LEVEL */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Level
          </label>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
        </div>

        {/* PROOF LINK */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Portfolio / Proof Link
          </label>

          <input
            type="url"
            value={proofLink}
            onChange={(e) => setProofLink(e.target.value)}
            placeholder="https://youtube.com/... or portfolio link"
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <p className="text-xs text-zinc-500 mt-2">
            Supports YouTube, Vimeo, Drive, Behance, portfolios, etc.
          </p>
        </div>

        {/* FILE UPLOAD */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Upload Proof
          </label>

          <div className="border border-dashed border-zinc-700 rounded-2xl p-6 bg-zinc-800/40">

            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.mp4,.mov"
              onChange={async (e) => {
                const selectedFile = e.target.files?.[0];

                if (!selectedFile) return;

                setFile(selectedFile);

                await handleFileUpload(selectedFile);
              }}
              className="block w-full text-sm text-zinc-300 file:mr-4 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30"
            />

            <p className="text-xs text-zinc-500 mt-3">
              Supported formats: PDF, PNG, JPG, MP4, MOV
            </p>

            {file && (
              <div className="mt-4 text-sm text-zinc-300">
                Selected: {file.name}
              </div>
            )}

            {uploading && (
              <div className="mt-4 text-indigo-400 text-sm">
                Uploading proof...
              </div>
            )}

            {!uploading && proofUrl && (
              <div className="mt-4 text-emerald-400 text-sm">
                Proof uploaded successfully ✓
              </div>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Proof Description (Optional)
          </label>

          <textarea
            value={proofDescription}
            onChange={(e) => setProofDescription(e.target.value)}
            placeholder="Describe the work you are submitting..."
            rows={4}
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
        >
          {uploading
            ? "Uploading..."
            : loading
            ? "Submitting..."
            : "Submit for Verification"}
        </button>

      </form>
    </div>
  );
}