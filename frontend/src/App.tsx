import "./App.css";
import { QueryClientProvider } from "./pages/query.tsx";
import { RouterProvider } from "./router.tsx";


function App() {
  return (
    <QueryClientProvider>
      <RouterProvider/>
    </QueryClientProvider>
  );
}

export default App;
