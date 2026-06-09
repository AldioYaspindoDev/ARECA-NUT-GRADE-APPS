Berikut adalah file **`setup-react-native.md`** yang berisi panduan lengkap setup proyek React Native dengan best practices untuk pemula. Anda bisa langsung menyimpannya dan menggunakannya sebagai referensi.

```markdown
# Panduan Setup Proyek React Native (Best Practices untuk Pemula)

Panduan ini menggunakan **Expo** (dengan TypeScript) untuk memudahkan pengembangan tanpa kehilangan fleksibilitas. Cocok untuk pemula yang ingin membangun aplikasi dengan struktur kode yang rapi, scalable, dan mudah dikelola.

---

## Prasyarat

- **Node.js** (versi LTS, minimal 18) - [Download](https://nodejs.org/)
- **Git** (opsional, namun disarankan)
- **Android Studio** (untuk emulator Android) atau **Xcode** (khusus Mac untuk iOS)
- **Expo Go** (aplikasi di HP Android/iOS) untuk testing cepat

---

## 1. Membuat Proyek Baru

```bash
npx create-expo-app MyBestProject --template
# Pilih template "Blank (TypeScript)"
cd MyBestProject
```

---

## 2. Install Alat Bantu (ESLint + Prettier)

```bash
npm install --save-dev eslint prettier eslint-config-expo eslint-plugin-prettier
npm init @eslint/config@latest
```

Pilih opsi:
- `To check syntax and find problems`
- `JavaScript modules`
- `None of these`
- `Yes` untuk TypeScript
- `Browser/Node`
- `Use popular style guide?` → **Tidak**
- Format file → `JSON`

Setelah itu, hapus file `.eslintrc` yang dihasilkan, lalu buat file **`.eslintrc.json`**:

```json
{
  "extends": ["expo", "prettier"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

Buat file **`.prettierrc`**:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 3. Struktur Folder (Rekomendasi)

```
my-app/
├── src/
│   ├── assets/          # gambar, font, ikon lokal
│   ├── components/      # komponen reusable (Button, Card, ...)
│   ├── constants/       # warna, ukuran, key storage
│   ├── hooks/           # custom hooks
│   ├── navigation/      # stack, tab, drawer navigator
│   ├── screens/         # halaman-halaman aplikasi
│   ├── services/        # API calls, AsyncStorage, notifikasi
│   ├── stores/          # state management (Zustand)
│   ├── types/           # TypeScript tipe/interface global
│   ├── utils/           # helper functions, format, validasi
│   └── App.tsx          # entry point sebenarnya
├── App.tsx              # hanya memanggil src/App
├── .env                 # environment variables (jangan commit!)
├── .gitignore           # pastikan .env masuk
├── app.json             # konfigurasi Expo
└── package.json
```

Buat file `src/App.tsx` sederhana:

```tsx
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello React Native!</Text>
    </View>
  );
}
```

Ubah `App.tsx` di root menjadi:

```tsx
import App from './src/App';
export default App;
```

---

## 4. Environment Variables (Menyimpan Rahasia)

```bash
npm install react-native-dotenv
```

Buat file **`.env`** di root proyek:

```
API_URL=https://jsonplaceholder.typicode.com
```

Ubah **`babel.config.js`**:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ]
  };
};
```

Contoh penggunaan di komponen:

```tsx
import { API_URL } from '@env';
console.log(API_URL);
```

---

## 5. Navigasi (React Navigation)

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack
```

Buat **`src/navigation/index.tsx`**:

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Details: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Jangan lupa buat file `screens/HomeScreen.tsx` dan `screens/DetailsScreen.tsx` sementara.

---

## 6. State Management (Zustand - Simple & Ringan)

```bash
npm install zustand
```

Buat **`src/stores/useCounterStore.ts`**:

```ts
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

Gunakan di komponen:

```tsx
import { useCounterStore } from '../stores/useCounterStore';
import { Button, Text, View } from 'react-native';

export default function Counter() {
  const { count, increment, decrement } = useCounterStore();
  return (
    <View>
      <Text>{count}</Text>
      <Button title="Tambah" onPress={increment} />
      <Button title="Kurang" onPress={decrement} />
    </View>
  );
}
```

---

## 7. HTTP Client dengan Axios + Interceptor

```bash
npm install axios
```

Buat **`src/services/api.ts`**:

```ts
import axios from 'axios';
import { API_URL } from '@env';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor request (tambahkan token jika ada)
api.interceptors.request.use(
  async (config) => {
    // const token = await getTokenFromStorage();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response (handle error global)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

---

## 8. Penyimpanan Lokal (AsyncStorage)

```bash
npm install @react-native-async-storage/async-storage
```

Buat **`src/services/storage.ts`**:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    return null;
  }
};
```

---

## 9. Komponen Reusable dengan TypeScript

Contoh **`src/components/Button.tsx`**:

```tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ title, onPress, variant = 'primary' }: ButtonProps) => (
  <TouchableOpacity
    style={[styles.button, variant === 'primary' ? styles.primary : styles.secondary]}
    onPress={onPress}
  >
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { padding: 12, borderRadius: 8, alignItems: 'center' },
  primary: { backgroundColor: '#007AFF' },
  secondary: { backgroundColor: '#DDDDDD' },
  text: { color: '#FFFFFF', fontWeight: '600' },
});
```

---

## 10. Ikon dan Font

```bash
npm install @expo/vector-icons
```

Contoh penggunaan:

```tsx
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="heart" size={24} color="red" />
```

---

## 11. Testing (Dasar)

```bash
npm install --save-dev @testing-library/react-native jest
```

Buat **`src/components/Button.test.tsx`**:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

test('button triggers onPress', () => {
  const onPressMock = jest.fn();
  const { getByText } = render(<Button title="Click" onPress={onPressMock} />);
  fireEvent.press(getByText('Click'));
  expect(onPressMock).toHaveBeenCalled();
});
```

Jalankan dengan `npm test`.

---

## 12. Menjalankan Aplikasi

```bash
# Untuk menggunakan Expo Go di HP (scan QR code)
npm start

# Untuk development build (butuh emulator/simulator)
npx expo run:android   # atau run:ios (Mac)
```

---

## 13. Best Practices Tambahan

- **Absolute Imports** – tambahkan di `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": { "@/*": ["src/*"] }
    }
  }
  ```
  Lalu install `babel-plugin-module-resolver` dan atur di `babel.config.js`.

- **Optimasi Rendering** – Gunakan `React.memo`, `useCallback`, `useMemo` hanya jika diperlukan.

- **Error Boundary** – Bungkus root komponen dengan error boundary agar aplikasi tidak crash total.

- **Environment terpisah** – Buat `.env.development` dan `.env.production` untuk staging/production.

- **Git Ignore** – Pastikan `.env`, `node_modules`, `.expo/`, `dist/` masuk ke `.gitignore`.

---

## Kesimpulan

Dengan panduan ini, proyek React Native Anda akan memiliki:
- Struktur folder yang bersih dan mudah dikembangkan
- Konsistensi kode dengan ESLint + Prettier
- Pengelolaan environment variables yang aman
- Navigasi, state management, dan HTTP client yang siap pakai
- Komponen reusable dan testing dasar

Selamat belajar dan membangun aplikasi React Native! 🚀
```

Simpan teks di atas sebagai file `setup-react-native.md` dan gunakan sesuai kebutuhan. Jika ada bagian yang ingin disesuaikan (misalnya mengganti Zustand dengan Redux Toolkit), Anda bisa memodifikasi langsung di file markdown tersebut.