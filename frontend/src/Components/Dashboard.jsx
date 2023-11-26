import React from 'react'
import { getAuth, signOut } from "firebase/auth";
import {useNavigate} from "react-router-dom";

const Dashboard = () => {
  const styles = {
    app: {
      fontFamily: 'Lato, sans-serif',
      background: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      margin: '15px',
      borderRadius: '5px'
    },
    topBar: {
      width: '98%',
      background: '#3498db',
      color: 'white',
      padding: '15px',
      fontSize: '20px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '5px',
      marginBottom: '15px'
    },
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '40px',
      width: '100%',
    },
    header: {
      width: '100%',
      background: '#e74c3c',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      fontSize: '40px',
      fontWeight: 'bold',
      marginBottom: '40px',
      textTransform: 'uppercase',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    section: {
      background: 'white',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
      marginBottom: '40px',
    },
    accountInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      margin: '20px 0',
      color: '#3498db',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    balance: {
      fontSize: '28px',
      color: '#3498db',
      fontWeight: 'bold',
    },
    transactions: {
      marginBottom: '40px',
    },
    transactionItem: {
      borderBottom: '1px solid #ddd',
      padding: '20px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '18px',
      color: '#e74c3c',
    },
    welcomeMessage: {
      textAlign: 'center',
      fontSize: '40px',
      fontWeight: 'bold',
      marginBottom: '40px',
      color: '#e74c3c',
    },
    summary: {
      fontSize: '20px',
      lineHeight: '1.6',
      color: '#3498db',
      marginBottom: '20px',
    },
    actionButton: {
      padding: '20px 40px',
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'white',
      background: '#e74c3c',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginRight: '20px',
      transition: 'background 0.3s ease-in-out',
    },
    actionButtonSecondary: {
      padding: '20px 40px',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#e74c3c',
      background: 'white',
      border: '2px solid #e74c3c',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'color 0.3s ease-in-out',
    },
    details: {
      fontSize: '16px',
      marginBottom: '20px',
    },
    additionalButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    additionalButton: {
      padding: '15px 30px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'white',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background 0.3s ease-in-out',
      border: 'none',
      marginRight: '5px'
    },
    additionalSection: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#e74c3c',
    },
    additionalContent: {
      fontSize: '18px',
      lineHeight: '1.6',
      color: '#2c3e50',
      marginBottom: '20px',
    },
    signOutButton: {
      padding: '10px',
      fontWeight: 'bold',
      color: 'white',
      background: '#e74c3c',
      border: 'none',
      borderRadius: '4px',
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
  };

  const transactionsData = [
    { title: 'Online Shopping', amount: '-$500.00' },
    { title: 'Gas Station', amount: '-$50.00' },
    { title: 'Coffee Shop', amount: '-$5.00' },
  ];
  const navigate = useNavigate();
  const auth = getAuth();

  function signOutUser() {
    signOut(auth).then(() => {
      navigate('/');
    }).catch((error) => {
      console.error("Sign out error", error);
    });

  }

  return (
      <div style={styles.app}>
        <div style={styles.topBar}>
          <span>Hello, {auth.currentUser.email}!</span>
          <button style={styles.signOutButton} onClick={signOutUser}>Sign Out</button>
        </div>
        <div style={styles.container}>
          <div style={{ ...styles.section, gridColumn: 'span 2' }}>
            <div style={styles.header}>Your Secure Account</div>
            <div style={styles.accountInfo}>
              <div>
                <div style={styles.balance}>Account Number: ************7564</div>
              </div>
              <div style={styles.balance}>Balance: $10,000.00</div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.transactions}>
              <div style={styles.welcomeMessage}>Recent Transactions</div>
              {transactionsData.map((transaction, index) => (
                  <div key={index} style={styles.transactionItem}>
                    <div>{transaction.title}</div>
                    <div>{transaction.amount}</div>
                  </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.header}>Account Overview</div>
            <div style={styles.summary}>
              Gain insights into your spending patterns and account trends. Use the chart above to
              visualize your financial activity.
            </div>
            <button style={styles.actionButton}>Explore Analytics</button>
          </div>

          <div style={styles.section}>
            <div style={styles.header}>E-Statements</div>
            <div style={styles.summary}>
              Your latest statement is available for download. Stay organized by accessing your
              statements online.
            </div>
            <button style={styles.actionButton}>Download Statement</button>
          </div>

          <div style={styles.section}>
            <div style={styles.header}>Account Services</div>
            <div style={styles.summary}>
              Explore additional services for your account. From setting up automatic payments to
              managing beneficiaries, we've got you covered.
            </div>
            <div style={styles.additionalButtons}>
              <button style={{ ...styles.additionalButton, background: '#e74c3c' }}>
                Automatic Payments
              </button>
              <button style={{ ...styles.additionalButton, background: '#f39c12' }}>
                Beneficiary Management
              </button>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.header}>Security Measures</div>
            <div style={styles.summary}>
              Your account security is our top priority. Explore the latest security measures we've
              implemented to protect your financial information.
            </div>
            <div style={styles.additionalButtons}>
              <button style={ styles.actionButton }>
                Two-Factor Authentication
              </button>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.header}>My Rewards</div>
            <div style={styles.summary}>
              <p>
                Explore the rewards you've earned with our program. Redeem them to enjoy exclusive benefits and offers.
              </p>
              <div style={styles.additionalButtons}>
                <button style={{ ...styles.additionalButton, background: '#e74c3c' }}>
                  Redeem Rewards
                </button>
                <button style={{ ...styles.additionalButton, background: '#f39c12' }}>
                  View All Rewards
                </button>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.header}>Investment Insights</div>
            <div style={styles.summary}>
              <p>
                Get a quick overview of your investment portfolio. Track the performance of your stocks, bonds, and mutual funds, and stay informed about market trends.
              </p>
              <div style={styles.additionalButtons}>
                <button style={ styles.actionButton }>
                  View Portfolio
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
  );
}

export default Dashboard;