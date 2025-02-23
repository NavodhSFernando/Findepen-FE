import { useState, useEffect } from 'react';
import axios from 'axios';

interface Transaction {
    id: string;
    amount: number;
    date: string;
    description: string;
}

const useGetTransactions = (url: string) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(url);
                setTransactions(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [url]);

    return { transactions, loading, error };
};

export default useGetTransactions;