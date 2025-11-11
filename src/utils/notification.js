import { toast } from "react-toastify";

const Notification = (type, content) => {
  if (type == "success") {
    return toast.success(content);
  } else {
    return toast.error(content);
  }
};

export default Notification;
