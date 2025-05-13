import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - HobbInventory</title>
        <meta
          name="description"
          content="Privacy Policy for HobbInventory.com"
        />
      </Head>
      <main
        style={{
          padding: "2rem",
          maxWidth: "800px",
          margin: "auto",
          fontFamily: "sans-serif",
        }}
      >
        <h1>Privacy Policy</h1>
        <p>
          <strong>Effective Date:</strong> March 1, 2025
        </p>
        <p>
          This Privacy Policy applies to the HobbInventory.com website (hereby
          referred to as &quot;Application&quot;) created by the individual developer
          operating under the name &quot;HobbInventory&quot; (hereby referred to as
          &quot;Service Provider&quot;) as a Free and Open Source service.
        </p>

        <h2>Information Collection and Use</h2>
        <p>
          The Application does not use tracking services or collect
          session-related data such as pages visited, time on site, or
          geolocation.
        </p>
        <p>
          When you authenticate using Google or Discord, the Application
          collects limited personal information:
        </p>
        <ul>
          <li>Email address (Google, Discord)</li>
          <li>Username (Discord)</li>
          <li>Name (Google)</li>
        </ul>
        <p>
          This data is stored securely and is not shared with third parties.
        </p>

        <h2>Third-Party Authentication</h2>
        <p>The Application uses OAuth login via:</p>
        <ul>
          <li>
            <a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer">
              Google
            </a>
          </li>
          <li>
            <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </li>
        </ul>

        <h2>Data Storage</h2>
        <p>
          User data is stored in a MongoDB database. Users may request deletion
          at any time by emailing{" "}
          <a href="mailto:hobbinventory@gmail.com">hobbinventory@gmail.com</a>.
        </p>

        <h2>Children</h2>
        <p>
          The Application is not intended for users under the age of 13. Any
          discovered data from such users will be deleted.
        </p>

        <h2>Security</h2>
        <p>
          The Service Provider implements standard security measures but cannot
          guarantee 100% security due to the nature of the Internet.
        </p>

        <h2>Changes</h2>
        <p>
          This policy may be updated. Please check this page periodically for
          updates.
        </p>

        <h2>Your Consent</h2>
        <p>By using the Application, you consent to this Privacy Policy.</p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions, contact us at{" "}
          <a href="mailto:hobbinventory@gmail.com">hobbinventory@gmail.com</a>.
        </p>
      </main>
    </>
  );
}