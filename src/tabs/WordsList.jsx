import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export default function WordsList() {
  const { user } = useAuth();
  const [note, setNote] = useState("");
  const [word, setWord] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "Whishlist"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return unsub;
  }, [user?.uid]);

  const addOrSave = async () => {
    const trimmed = word.trim();
    const trimmedNote = note.trim();

    if (!trimmed || !user) return;

    if (editingId) {
      await updateDoc(
        doc(db, "Whishlist", editingId),
        { text: trimmed, note: trimmedNote },
        {}
      );
      setEditingId(null);
    } else {
      await addDoc(collection(db, "Whishlist"), {
        text: trimmed,
        note: trimmedNote,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });
    }
    setWord("");
    setNote("");
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setWord(item.text);
    setNote(item.note || "");
  };
  const remove = async (id) => {
    await deleteDoc(doc(db, "Whishlist", id));
    if (editingId === id) {
      setEditingId(null);
      setWord("");
      setNote("");
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Your Wishlist</Text>
      <View style={s.row}>
        <TextInput
          style={[s.input, { flex: 1 }]}
          placeholder="Item"
          value={word}
          onChangeText={setWord}
          autoCapitalize="none"
        />
        <TextInput
          style={[s.input, { flex: 1 }]}
          placeholder="Note or Description"
          value={note}
          onChangeText={setNote}
          autoCapitalize="none"
        />
        <View style={{ width: 8 }} />
        <Button
          title={editingId ? "Save" : "Add"}
          color="#FFC400"
          onPress={addOrSave}
        />
      </View>

      <FlatList
        style={{ marginTop: 16 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={{ display: "flex", flexDirection: "column" }}>
              <Text style={s.word}>{item.text}</Text>
              {item.note ? <Text style={s.note}>{item.note}</Text> : null}{" "}
            </View>
            <View style={s.cardButtons}>
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Ionicons name="create-outline" size={25} color="#8C00FF" />
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 8 }}>|</Text>
              <TouchableOpacity onPress={() => remove(item.id)}>
                <Ionicons name="trash-outline" size={25} color="#FF3F7F" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={s.subtle}>No words yet. Add one ↑</Text>
        }
      />
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 20,
  },
  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  subtle: { color: "#666", marginTop: 8 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  word: { fontSize: 18, fontWeight: "600" },
  note: { fontSize: 14, color: "#555", marginTop: 5 },
  cardButtons: { flexDirection: "row", alignItems: "center" },
  link: { fontSize: 16, color: "#06c" },
});
