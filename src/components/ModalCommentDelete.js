import axios from 'axios';
import Modal from 'react-modal';
import { pushDefaultWithToken } from '../util/axiosHelper';
import CommonButton, {
  BUTTON_TYPE_USER,
  BUTTON_TYPE_USER_DELETE,
} from './CommonButton';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

/**
 * Create by @KimTank
 *
 * 불러오는측에서
 * const [modalIsOpen, setIsOpen] = useState(false);
 * ReactModal.setAppElement('#app');
 * @param { deleteModalIsOpen, setIsDeleteModalOpen }
 * @returns <Modal>
 */
function ModalCommentDelete({
  commentDeleteModalIsOpen,
  setCommentDeleteModalOpen,
  postId,
  commentId,
  setPost,
}) {
  const handleDelete = () => {
    axios
      .delete(
        `${process.env.REACT_APP_EP_COMMENT_DELETE}/${postId}${process.env.REACT_APP_EP_COMMENT}/${commentId}`,
        pushDefaultWithToken()
      )
      .then(() => {
        axios
          .get(`${process.env.REACT_APP_EP_POSTS_DETAIL}/${postId}`, {
            withCredentials: true,
          })
          .then((response) => {
            const { data } = response;
            setPost(data);
            closeModal();
          })
          .catch((error) => alert(error));
      })
      .catch((error) => {
        let errorText;
        const { message } = error;
        const code = Number(message.slice(-3));
        switch (code) {
          case 401:
          case 404:
          case 500:
          default:
            errorText = message;
        }
        return alert(errorText);
      });
  };

  const closeModal = () => {
    setCommentDeleteModalOpen(false);
  };
  return (
    <Modal
      isOpen={commentDeleteModalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Delete Comment"
    >
      <h2>Delete Comment</h2>
      <CommonButton
        buttonType={BUTTON_TYPE_USER_DELETE}
        onClick={handleDelete}
        cont={'Delete'}
      />
      <CommonButton
        buttonType={BUTTON_TYPE_USER}
        onClick={closeModal}
        cont={'Close'}
      />
    </Modal>
  );
}

export default ModalCommentDelete;
