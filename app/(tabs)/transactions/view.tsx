import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import Title from "@/components/ui/Title";
import CircleButton from "@/components/ui/CircleButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "@/components/ui/Button";
import useTransactions from "@/hooks/useTransactions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface TransactionDetails {
  Id: string;
  Title: string;
  Description?: string;
  Amount: number;
  Category?: string;
  Type: "Income" | "Expense";
  Date: string;
}

const TransactionViewPage: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTransactionById, deleteTransaction } = useTransactions();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<TransactionDetails | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (id) {
        try {
          const transactionData = await getTransactionById(id);
          if (transactionData) {
            setTransaction(transactionData);
          } else {
            Alert.alert("Error", "Transaction not found. (ID: " + id + ")");
            router.replace("/transactions");
          }
        } catch (error) {
          console.error("Error fetching transaction:", error);
          Alert.alert("Error", "Failed to load transaction");
          router.replace("/transactions");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransaction();
  }, [id, router]);

  const handleEdit = () => {
    router.push(`/transactions/edit?id=${id}`);
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              const success = await deleteTransaction(id!);
              if (success) {
                Alert.alert("Success", "Transaction deleted successfully", [
                  {
                    text: "OK",
                    onPress: () => router.replace("/transactions"),
                  },
                ]);
              } else {
                Alert.alert(
                  "Error",
                  "Failed to delete transaction. Please try again."
                );
              }
            } catch (err) {
              console.error("Transaction deletion error:", err);
              Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (amount: number, type: string) => {
    const safeAmount = amount || 0;
    const sign = type === "Expense" ? "-" : "+";
    return `${sign} Rs ${safeAmount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading transaction...</Text>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Transaction not found</Text>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.secondary,
        dark: Colors.secondary,
      }}
      headerImage={
        <View style={styles.topContainer}>
          <View style={styles.backButtonContainer}>
            <CircleButton
              icon="chevron-back"
              onPress={() => router.replace("/transactions")}
              size={40}
            />
          </View>
          <Title text="Transaction Details" />
        </View>
      }
    >
      <View style={styles.bodyContainer}>
        {/* Transaction Type Badge */}
        <View style={styles.typeContainer}>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  transaction.Type === "Expense"
                    ? Colors.primary
                    : Colors.secondary,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={transaction.Type === "Expense" ? "arrow-down" : "arrow-up"}
              size={16}
              color={Colors.background}
            />
            <Text
              style={[
                styles.typeText,
                {
                  color: Colors.background,
                },
              ]}
            >
              {transaction.Type}
            </Text>
          </View>
        </View>

        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>
            {formatCurrency(transaction.Amount, transaction.Type)}
          </Text>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Title</Text>
            <Text style={styles.detailValue}>{transaction.Title}</Text>
          </View>

          {transaction.Description && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{transaction.Description}</Text>
            </View>
          )}

          {transaction.Category && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{transaction.Category}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(transaction.Date)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Button
            title="Edit"
            onPress={handleEdit}
            variant="primary"
            disabled={deleting}
          />
          <Button
            title={deleting ? "Deleting..." : "Delete"}
            onPress={handleDelete}
            variant="secondary"
            disabled={deleting}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default TransactionViewPage;

const styles = StyleSheet.create({
  topContainer: {
    padding: 40,
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 24,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Colors.background,
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  backButtonContainer: {
    position: "absolute",
    top: 70,
    left: 40,
    zIndex: 1000,
  },
  typeContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  typeText: {
    fontSize: 14,
    fontFamily: "JakarthaBold",
    textTransform: "uppercase",
  },
  amountContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.fadedText,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontFamily: "JakarthaBold",
    color: Colors.text,
  },
  detailsContainer: {
    width: "100%",
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "JakarthaRegular",
    color: Colors.fadedText,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "JakarthaBold",
    color: Colors.text,
    flex: 2,
    textAlign: "right",
  },
  actionButtonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: "auto",
    paddingTop: 40,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text,
  },
});
