'use client';

import * as React from 'react';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Loader2, History, AlertCircle } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HistoryPage() {
    const { user, loading } = useAuth();
    const [history, setHistory] = React.useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = React.useState(true);

    React.useEffect(() => {
        async function fetchHistory() {
            if (!user || !db) {
                setIsLoadingHistory(false);
                return;
            }

            try {
                const q = query(
                    collection(db, 'users', user.uid, 'history'),
                    orderBy('timestamp', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setHistory(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setIsLoadingHistory(false);
            }
        }

        if (!loading) {
            fetchHistory();
        }
    }, [user, loading]);


    if (loading || isLoadingHistory) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Sign in to view history</h2>
                <p className="text-muted-foreground">
                    Your conversation history is stored securely. Please sign in to access it.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AppHeader
                title="History"
                description="View your past template conversions and compliance checks."
            />

            {history.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <History className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No history found. Start converting templates to see them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((item) => (
                        <Card key={item.id} className="bg-card hover:bg-accent/5 transition-colors">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-base font-semibold truncate pr-4">
                                        {item.brand || 'Untitled Template'}
                                    </CardTitle>
                                    <Badge variant="outline" className="text-xs">
                                        {item.type || 'CONVERSION'}
                                    </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="line-clamp-3 text-muted-foreground italic">
                                    "{item.originalTemplate}"
                                </div>
                                {item.result?.compliance_check && (
                                    <div className="pt-2 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${item.result.compliance_check === 'PASS' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className="font-medium">{item.result.compliance_check}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
