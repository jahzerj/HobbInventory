import Head from "next/head";

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Terms and Conditions - HobbInventory</title>
        <meta name="description" content="Terms and Conditions for HobbInventory.com" />
      </Head>
      <main style={{ padding: "2rem", maxWidth: "800px", margin: "auto", fontFamily: "sans-serif" }}>
        <h1>Terms and Conditions</h1>
        <p><strong>Effective Date:</strong> March 1, 2025</p>

        <p>
          These terms and conditions apply to the HobbInventory.com website (hereby referred to as &quot;Application&quot;) created and maintained by the developer operating under the name &quot;HobbInventory&quot; (hereby referred to as &quot;Service Provider&quot;) as a Free and Open Source service.
        </p>

        <h2>Usage Rights</h2>
        <p>
          You are granted a limited, non-exclusive, non-transferable, and revocable license to use the Application for personal or non-commercial use.
        </p>

        <h2>Third-Party Services</h2>
        <p>The Application uses the following third-party login providers:</p>
        <ul>
          <li><a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Google</a></li>
          <li><a href="https://discord.com/terms" target="_blank" rel="noopener noreferrer">Discord</a></li>
        </ul>

        <h2>User Responsibility</h2>
        <p>
          You are responsible for maintaining the confidentiality of your login credentials. The Service Provider is not liable for unauthorized access resulting from compromised credentials.
        </p>

        <h2>Data and Account Deletion</h2>
        <p>
          You may request deletion of your data by contacting <a href="mailto:hobbinventory@gmail.com">hobbinventory@gmail.com</a>.
        </p>

        <h2>Liability Disclaimer</h2>
        <p>
          The Application is provided &quot;as is&quot;. The Service Provider does not guarantee uptime, bug-free performance, or continuous availability.
        </p>

        <h2>Modifications</h2>
        <p>
          The Service Provider reserves the right to modify or terminate the Application at any time without prior notice.
        </p>

        <h2>Changes</h2>
        <p>
          These Terms may be updated at any time. Please check this page for updates.
        </p>

        <h2>Contact Us</h2>
        <p>If you have questions, email us at <a href="mailto:hobbinventory@gmail.com">hobbinventory@gmail.com</a>.</p>
      </main>
    </>
  );
}