import React from 'react';
import Countdown from 'react-countdown';
import { Clock, Gavel } from 'lucide-react';

// Timer display component
const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
        return <span style={{ color: 'red', fontWeight: 'bold' }}>Auction Ended!</span>;
    } else {
        return (
            <div style={styles.timerContainer}>
                <Clock size={16} style={{ marginRight: '5px' }} />
                <span>{days}d : {hours}h : {minutes}m : {seconds}s</span>
            </div>
        );
    }
};

const AuctionItemCard = ({ item }) => {
    return (
        <div style={styles.card}>
            <div style={styles.imageContainer}>
                <img src={item.image} alt={item.title} style={styles.image} />
                {/* Floating timer on top of image */}
                <div style={styles.floatingTimer}>
                    <Countdown date={new Date(item.endDate)} renderer={renderer} />
                </div>
            </div>

            <div style={styles.details}>
                <h3 style={styles.title}>{item.title}</h3>
                <p style={styles.lotInfo}>Lot No: #{item.id} | Category: {item.category || 'Coins'}</p>

                <div style={styles.bidSection}>
                    <div>
                        <p style={styles.bidLabel}>Current Bid:</p>
                        <p style={styles.price}>৳ {item.currentBid?.toLocaleString() || '0'}</p>
                    </div>
                    <div style={styles.bidCount}>
                        <Gavel size={14} /> {item.totalBids || 0} Bids
                    </div>
                </div>

                <button style={styles.bidButton}>Bid Now</button>
            </div>
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        maxWidth: '300px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    },
    imageContainer: {
        position: 'relative',
        height: '200px',
        backgroundColor: '#f4f4f4',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    floatingTimer: {
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '20px',
        fontSize: '12px',
    },
    timerContainer: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: '600',
    },
    details: {
        padding: '15px',
    },
    title: {
        fontSize: '16px',
        margin: '0 0 10px 0',
        color: '#333',
    },
    lotInfo: {
        fontSize: '12px',
        color: '#777',
        marginBottom: '15px',
    },
    bidSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
        marginBottom: '15px',
    },
    bidLabel: {
        fontSize: '12px',
        color: '#777',
        margin: 0,
    },
    price: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#d32f2f',
        margin: 0,
    },
    bidCount: {
        fontSize: '12px',
        color: '#555',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    bidButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#d32f2f',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
    },
};

export default AuctionItemCard;
