import React, { useState } from 'react';

const LiveBidding = () => {
    const [isAuctionLive, setIsAuctionLive] = useState(true);

    // Sample live bid data
    const liveBids = [
        { bidder: 'User_DXB', amount: 12000, time: '10:30:45 AM' },
        { bidder: 'Collector_CAL', amount: 11500, time: '10:30:40 AM' },
        { bidder: 'MughalLover', amount: 11000, time: '10:30:30 AM' },
        { bidder: 'CoinExpert99', amount: 10500, time: '10:30:20 AM' },
    ];

    if (!isAuctionLive) {
        return (
            <div style={styles.noLiveContainer}>
                <h2>No Live Auction Currently Running</h2>
                <p>Next Live Auction: <strong>Gangaridai Heritage Sale #45</strong></p>
                <div style={styles.scheduleBox}>
                    <h3>📅 Date: 25th January 2025</h3>
                    <h3>⏰ Time: 6:00 PM BDT</h3>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.liveContainer}>
            {/* Left Side - Video Player */}
            <div style={styles.videoSection}>
                <div style={styles.videoPlaceholder}>
                    <h3>🔴 Live Video Feed</h3>
                    <p>Auctioneer is presenting Lot #105</p>
                    <div style={styles.liveIndicator}>● LIVE</div>
                </div>
                <div style={styles.currentItemBox}>
                    <h4>Currently Selling: Gold Mohur of Akbar</h4>
                    <p>Current Ask: ৳ 12,000</p>
                </div>
            </div>

            {/* Right Side - Real-time Bid Log */}
            <div style={styles.bidLogSection}>
                <h3 style={styles.logHeader}>Real-Time Bid Log</h3>
                <div style={styles.bidList}>
                    {liveBids.map((bid, index) => (
                        <div key={index} style={styles.bidRow}>
                            <span style={styles.bidTime}>{bid.time}</span>
                            <span>{bid.bidder} bid</span>
                            <span style={styles.bidAmount}>৳{bid.amount.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                <div style={styles.quickBidControls}>
                    <button style={styles.bidBtn}>Bid ৳12,500</button>
                    <button style={styles.bidBtn}>Bid ৳13,000</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    noLiveContainer: {
        padding: '50px',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scheduleBox: {
        marginTop: '20px',
        padding: '20px',
        border: '1px dashed #ccc',
        display: 'inline-block',
        borderRadius: '8px',
    },
    liveContainer: {
        display: 'flex',
        height: '80vh',
        border: '1px solid #ccc',
    },
    videoSection: {
        flex: 2,
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
    },
    videoPlaceholder: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #1a1a1a, #2c3e50)',
        position: 'relative',
    },
    liveIndicator: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: '#ff0000',
        color: 'white',
        padding: '5px 15px',
        borderRadius: '20px',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    currentItemBox: {
        padding: '20px',
        backgroundColor: '#222',
        borderTop: '2px solid #d32f2f',
    },
    bidLogSection: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        borderLeft: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
    },
    logHeader: {
        padding: '15px',
        margin: 0,
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
    },
    bidList: {
        flex: 1,
        overflowY: 'auto',
        padding: '10px',
    },
    bidRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid #eee',
        fontSize: '14px',
    },
    bidTime: { color: '#999', fontSize: '12px' },
    bidAmount: { fontWeight: 'bold', color: 'green' },
    quickBidControls: {
        padding: '15px',
        backgroundColor: '#fff',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '10px',
    },
    bidBtn: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#2e7d32',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
    },
};

export default LiveBidding;
