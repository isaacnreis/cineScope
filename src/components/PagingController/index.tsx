import { useMovieContext } from "../../context/MovieContext.tsx";
import styles from "./PagingController.module.scss";

const PagingController = () => {
  const { state, dispatch } = useMovieContext();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= state.totalPages) {
      dispatch({ type: "SET_PAGE", payload: newPage });
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => handlePageChange(state.currentPage - 1)}
        disabled={state.currentPage === 1}
      >
        Anterior
      </button>
      <span>
        Página {state.currentPage} de {state.totalPages}
      </span>
      <button
        onClick={() => handlePageChange(state.currentPage + 1)}
        disabled={state.currentPage === state.totalPages}
      >
        Próxima
      </button>
    </div>
  );
};

export default PagingController;
