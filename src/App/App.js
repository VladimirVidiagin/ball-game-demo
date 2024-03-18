import { Provider } from "react-redux";
import { store } from "../store/store";
import Board from "../features/Board/ui/Board";

function App() {
  return (
    <Provider store={store}>
      <Board width="1000" height="500" />
    </Provider>
  );
}

export default App;
