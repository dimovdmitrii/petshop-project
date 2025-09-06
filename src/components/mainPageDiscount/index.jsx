import React, { useState } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import imgDiscount from "../../assets/images/image-disk.svg";
import styles from "./styles.module.css";

function MainPageDiscount() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3333/sale/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', phone: '', email: '' });
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className={styles.discountContainer}>
      <div className={styles.discount}>
        <Typography className={styles.title} sx={{
        color: 'white', 
        textAlign: 'center',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: { xs: 32, sm: 48, md: 64 },
        fontWeight: 700, 
        lineHeight: '110%',
        
     
      }}>
          5% off on the first order
        </Typography>
        
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <img src={imgDiscount} alt="Pets" className={styles.petsImage} />
          </div>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              sx={{
                '& .MuiOutlinedInput-root': {
                  width: '100%',
                  height: { xs: '36px', sm: '40px', md: '44px', lg: '50px', xl: '58px' },
                  borderRadius: '6px',
                  color: 'white',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '10px', sm: '12px', md: '12px', lg: '14px', xl: '20px' },
                  fontWeight: 500,
                  lineHeight: '130%',
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                  '& input': {
                    padding: { xs: '10px 16px !important', sm: '12px 20px !important', md: '12px 20px !important', lg: '15px 28px !important', xl: '16px 32px !important' }
                  },
                  '& input::placeholder': {
                    color: 'white',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '10px', sm: '12px', md: '12px', lg: '14px', xl: '20px' },
                    fontWeight: 500,
                    lineHeight: '130%',
                    opacity: 1
                  }
                }
              }}
              required
            />
            
            <TextField
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleInputChange}
              className={styles.input}
              sx={{
                '& .MuiOutlinedInput-root': {
                  width: '100%',
                  height: { xs: '36px', sm: '40px', md: '44px', lg: '50px', xl: '58px' },
                  borderRadius: '6px',
                  color: 'white',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '10px', sm: '12px', md: '12px', lg: '14px', xl: '20px' },
                  fontWeight: 500,
                  lineHeight: '130%',
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                  '& input': {
                    padding: { xs: '10px 16px !important', sm: '12px 20px !important', md: '12px 20px !important', lg: '15px 28px !important', xl: '16px 32px !important' }
                  },
                  '& input::placeholder': {
                    color: 'white',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '10px', sm: '12px', md: '12px', lg: '14px', xl: '20px' },
                    fontWeight: 500,
                    lineHeight: '130%',
                    opacity: 1
                  }
                }
              }}
              required
            />
            
            <TextField
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              sx={{
                '& .MuiOutlinedInput-root': {
                  width: '100%',
                  height: { xs: '36px', sm: '40px', md: '44px', lg: '50px', xl: '58px' },
                  borderRadius: '6px',
                  color: 'white',
                  fontFamily: 'Montserrat',
                  fontSize: { xs: '10px', sm: '12px', md: '12px', lg: '14px', xl: '20px' },
                  fontWeight: 500,
                  lineHeight: '130%',
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                  '& input': {
                    padding: { xs: '10px 16px !important', sm: '12px 20px !important', md: '12px 20px !important', lg: '15px 28px !important', xl: '16px 32px !important' }
                  },
                  '& input::placeholder': {
                    color: 'white',
                    fontFamily: 'Montserrat',
                    fontSize: { xs: '10px', sm: '12px', md: '12px', lg: '14px', xl: '20px' },
                    fontWeight: 500,
                    lineHeight: '130%',
                    opacity: 1
                  }
                }
              }}
              required
            />
            
            <Button
              type="submit"
              className={styles.submitButton}
              sx={{
                background: ' #FFF',
                color: ' #282828',
                textAlign: 'center',
                fontFamily: 'Montserrat',
                fontSize: { xs: '10px', sm: '12px', md: '12px', lg: '14px', xl: '20px' },
                fontWeight: 600,
                lineHeight: '130%',
                textTransform: 'none',
                width: '100%',
                height: { xs: '36px', sm: '40px', md: '44px', lg: '50px', xl: '58px' },
                '&:hover': {
                  background: '#000',
                  color: '#FFF'
                }
              }}
            >
              {isSubmitted ? 'Request Submitted' : 'Get a discount'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default MainPageDiscount;