import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Button, Modal, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_URL } from '../../config/api';
import CartBasket from '../../components/cartBasket';
import { clearBasket } from '../../redux/slices/basketSlice';
import styles from './styles.module.css';
import modalx from '../../assets/icons/modalx.svg';

const Basket = () => {
  const dispatch = useDispatch();
  const { items, total, count } = useSelector(state => state.basket);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const orderData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.discont_price || item.price
        })),
        total: total
      };
      
      // Отправляем запрос на бэкенд (не ждем ответа)
      axios.post(`${API_URL}/order/send`, orderData)
        .catch(error => {
          console.error('Error sending order:', error);
        });
      
      // Сразу показываем модальное окно
      setIsModalOpen(true);
      
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Очищаем корзину и форму только после закрытия модалки
    dispatch(clearBasket());
    reset();
  };

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Shopping cart</h2>
          <Link to="/categories" className={styles.backToStoreBtn}>
            Back to the store
          </Link>
        </div>
        
        <div className={styles.emptyCart}>
          <Typography sx={{
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '130%',
  }}>Looks like you have no items in your basket currently.</Typography>
          <Link to="/categories" className={styles.shopBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Shopping cart</h2>
        <Link to="/categories" className={styles.backToStoreBtn}>
          Back to the store
        </Link>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Cart Items */}
        <div className={styles.cartItems}>
          {items.map((item) => (
            <CartBasket key={item.id} product={item} />
          ))}
        </div>

        {/* Order Details */}
        <div className={styles.orderDetails}>
          <Typography sx={{
    fontFamily: 'Montserrat',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '110%',
  }} >Order details</Typography>
          
          <div className={styles.summary}>
            <Typography sx={{
    color: '#8B8B8B',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '130%',
  }} className={styles.itemsCount}>{count} items</Typography>
            <div className={styles.totalRow}>
              <Typography sx={{
    color: '#8B8B8B',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '130%',
  }} className={styles.totalLabel}>Total</Typography>
              <Typography sx={{
    color: '#282828',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 64,
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '110%',
  }} className={styles.totalAmount}>${total.toFixed(2).replace('.', ',')}</Typography>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.orderForm}>
            <input
              {...register('name', { required: 'Name is required' })}
              placeholder="Name"
              className={styles.formInput}
            />

            <input
              {...register('phone', { 
                required: 'Phone is required',
                pattern: {
                  value: /^[\+]?[0-9][\d]{0,15}$/,
                  message: 'Invalid phone number'
                }
              })}
              placeholder="Phone number"
              className={styles.formInput}
            />

            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="Email"
              className={styles.formInput}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              sx={{
                width: '100%',
                height: '58px',
                backgroundColor: '#0D50FF',
                color: '#FFF',
                border: 'none',
                borderRadius: '6px',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: 'auto',
                '&:hover': {
                  backgroundColor: '#0a3dcc',
                  color: '#FFF'
                },
                '&:disabled': {
                  backgroundColor: '#8B8B8B',
                  color: '#FFF',
                  cursor: 'not-allowed'
                }
              }}
            >
              {isSubmitting ? 'Processing...' : 'Order'}
            </Button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          zIndex: 9999
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 'calc(50% - 155px)',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '327px', md: '548px' },
            height: { xs: '155px', md: '236px' },
            bgcolor: '#0D50FF',
            borderRadius: '12px',
            boxShadow: 24,
            p: { xs: '8px', md: '32px' },
            textAlign: 'left',
            zIndex: 10000
          }}
        >
          {/* Крестик для закрытия */}
          <button className={styles.closeButton}
            onClick={handleCloseModal}            
            aria-label="Close modal"
          >
            <img className={styles.closeIcon}
              src="/src/assets/icons/modalx.svg" 
              alt="close"               
            />
          </button>
          
          <Typography 
            id="modal-title" 
            variant="h5" 
            component="h2" 
            sx={{ 
              mb: '24px',
              color: 'white',
              fontFamily: 'Montserrat',
              fontSize: { xs: '20px', md: '40px' },
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '110%'
            }}
          >
            Congratulations!
          </Typography>
          <Typography 
            id="modal-description" 
            sx={{ 
              color: 'white',
              fontFamily: 'Montserrat',
              fontSize: { xs: '16px', md: '20px' },
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '110%',
              maxWidth: '424px'
            }}
          >
            Your order has been successfully placed on the website.<br /> <br />
            A manager will contact you shortly to confirm your order.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Basket;