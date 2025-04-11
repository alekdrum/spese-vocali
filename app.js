import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function App() {
  const [input, setInput] = useState('');
  const [records, setRecords] = useState([]);

  const handleAdd = () => {
    const words = input.toLowerCase().split(' ');
    const amount = parseFloat(words.find(w => !isNaN(w.replace(',', '.'))));
    const isIncome = input.includes('guadagnato') || input.includes('entrata');
    const category = words.find(w => !['ho', 'speso', 'guadagnato', 'euro', 'per', 'entrata'].includes(w));

    if (isNaN(amount)) {
      alert('Importo non valido');
      return;
    }

    const newRecord = {
      id: Date.now().toString(),
      amount: isIncome ? amount : -amount,
      category: category || 'Altro',
    };

    setRecords([newRecord, ...records]);
    setInput('');
  };

  const total = records.reduce((sum, r) => sum + r.amount, 0);
  const categories = records.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + r.amount;
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Spese Vocali</Text>

      <TextInput
        style={styles.input}
        placeholder="Es: ho speso 25 euro per cibo"
        value={input}
        onChangeText={setInput}
      />

      <Button title="Aggiungi spesa" onPress={handleAdd} />

      <Text style={styles.total}>Totale: {total.toFixed(2)} €</Text>

      <FlatList
        data={records}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.amount > 0 ? 'Entrata' : 'Uscita'}: {Math.abs(item.amount)}€ – {item.category}
          </Text>
        )}
      />

      {Object.keys(categories).length > 0 && (
        <LineChart
          data={{
            labels: Object.keys(categories),
            datasets: [{ data: Object.values(categories) }],
          }}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          }}
          style={{ marginVertical: 20 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  total: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    marginVertical: 4,
  },
});
