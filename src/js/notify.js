import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export const notify = {
  success(msg) {
    iziToast.success({
      title: "Успіх",
      message: msg,
      position: "topRight",
      timeout: 4000,
    });
  },
  error(msg) {
    iziToast.error({
      title: "Помилка",
      message: msg,
      position: "topRight",
      timeout: 4000,
    });
  },
  warning(msg) {
    iziToast.warning({
      title: "Увага",
      message: msg,
      position: "topRight",
      timeout: 5000,
    });
  },
  info(msg) {
    iziToast.info({
      title: "Інфо",
      message: msg,
      position: "topRight",
      timeout: 4000,
    });
  },
};
