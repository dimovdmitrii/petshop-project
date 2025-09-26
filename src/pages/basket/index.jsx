import { useState, useEffect } from 'react';
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getSize = (base) => base * (windowWidth <= 1000 ? 0.6 : windowWidth <= 1100 ? 0.65 : windowWidth <= 1300 ? 0.7 : windowWidth <= 1320 ? 0.75 : windowWidth <= 1439 ? 0.8 : 1);
  const fontSize = {
    orderTitle: getSize(40),
    itemsCount: getSize(24),
    totalLabel: getSize(24),
    totalAmount: windowWidth > 1439 ? 64 : getSize(40)
  };

  const textStyle = (size, color = '#282828', weight = 700) => ({
    fontFamily: 'Montserrat',
    fontSize: `${size}px`,
    fontWeight: weight,
    lineHeight: weight === 700 ? '110%' : '130%',
    color,
    margin: 0
  });

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
      
      axios.post(`${API_URL}/order/send`, orderData)
        .catch(error => {
        });
      
      setIsModalOpen(true);
      
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(clearBasket());
    reset();
  };

  const renderHeader = () => (
    <div className={styles.header}>
      <h2 className={styles.title}>Shopping cart</h2>
      <Link to="/categories" className={styles.backToStoreBtn}>
        Back to the store
      </Link>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        {renderHeader()}
        
        <div className={styles.emptyCart}>
          <Typography sx={textStyle(20, '#8B8B8B', 500)}>
            Looks like you have no items in your basket currently.
          </Typography>
          <Link to="/categories" className={styles.shopBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {renderHeader()}

      <div className={styles.mainContent}>
        <div className={styles.cartItems}>
          {items.map((item) => (
            <CartBasket key={item.id} product={item} />
          ))}
        </div>

        <div className={styles.orderDetails}>
          <h3 style={textStyle(fontSize.orderTitle)}>Order details</h3>
          
          <div className={styles.summary}>
            <p style={textStyle(fontSize.itemsCount, '#8B8B8B', 500)}>{count} items</p>
            <div className={styles.totalRow}>
              <p style={textStyle(fontSize.totalLabel, '#8B8B8B', 500)}>Total</p>
              <p style={textStyle(fontSize.totalAmount)}>${Math.round(total)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.orderForm}>
            <input
              {...register('name')}
              placeholder="Name"
              className={styles.formInput}
              required
            />

            <input
              {...register('phone', { 
                
                pattern: {
                  value: /^[\+]?[0-9][\d]{0,15}$/,
                  message: 'Invalid phone number'
                }
              })}
              placeholder="Phone number"
              className={styles.formInput}
              required
            />

            <input
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="Email"
              className={styles.formInput}
              required 
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              sx={{
                width: '100%', height: '58px', backgroundColor: '#0D50FF', color: '#FFF',
                borderRadius: '6px', fontFamily: 'Montserrat', fontSize: '16px',
                fontWeight: 600, textTransform: 'none', marginTop: 'auto',
                '&:hover': { backgroundColor: '#0a3dcc' },
                '&:disabled': { backgroundColor: '#8B8B8B', cursor: 'not-allowed' }
              }}
            >
              {isSubmitting ? 'Processing...' : 'Order'}
            </Button>
          </form>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          zIndex: 9999
        }}
      >
        <Box sx={{
          position: 'absolute', top: 'calc(50% - 155px)', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '327px', md: '548px' }, height: { xs: '155px', md: '236px' },
          bgcolor: '#0D50FF', borderRadius: '12px', boxShadow: 24,
          p: { xs: '8px', md: '32px' }, textAlign: 'left', zIndex: 10000
        }}>
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
              mb: '24px', color: 'white', fontFamily: 'Montserrat',
              fontSize: { xs: '20px', md: '40px' }, fontWeight: 600, lineHeight: '110%'
            }}
          >
            Congratulations!
          </Typography>
          <Typography 
            id="modal-description" 
            sx={{ 
              color: 'white', fontFamily: 'Montserrat', fontSize: { xs: '16px', md: '20px' },
              fontWeight: 600, lineHeight: '110%', maxWidth: '424px'
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