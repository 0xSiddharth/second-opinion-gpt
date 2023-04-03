import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [symptomsInput, setSymptomsInput] = useState("");
  const [diagnosis, setDiagnosis] = useState("");  // <-- Change here

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: symptomsInput }),
      });

      // Clone the response and log the raw response text
      const clonedResponse = response.clone();
      console.log('Raw response:', await clonedResponse.text());

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setDiagnosis(data.result);
      setSymptomsInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>2ndOpinion.ai</title>
        <link rel="icon" href="images/secondOpinionLogo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/images/secondOpinionLogo.png" className={styles.icon} />
        <h3>Get a 2ndOpinion</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="symptoms"
            placeholder="Provide your age, gender & describe your symptoms in detail"
            value={symptomsInput}
            onChange={(e) => setSymptomsInput(e.target.value)}
          />
          <input type="submit" value="Generate diagnosis" />
        </form>
        {diagnosis && (  // <-- Change here
          <div className={styles.result}>
            <h4>Diagnosis:</h4>
            <p>{diagnosis}</p>
          </div>
        )}
      </main>
    </div>
  );
}


