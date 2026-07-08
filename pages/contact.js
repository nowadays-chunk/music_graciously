import React from 'react';
import { Container, Typography, Box, Paper, Divider, Grid } from '@mui/material';
import Head from 'next/head';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { DEFAULT_KEYWORDS } from '../data/seo';

const Contact = () => {
    return (
        <>
            <Head>
                <title>Contact Us | Guitar Sheets Media</title>
                <meta name="description" content="Get in touch with Hamza Eljaouhari for support, inquiries, or feedback regarding Guitar Sheets Media." />
                <meta name="keywords" content={`${DEFAULT_KEYWORDS}, contact, Hamza Eljaouhari, support, musical theory`} />
            </Head>
            <Container maxWidth="md" sx={{ py: 15 }}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, border: '1px solid #eee', borderRadius: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Contact Us
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Have questions about our products or your order? We are here to help.
                    </Typography>
                    <Divider sx={{ my: 4 }} />

                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <EmailIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" fontWeight="bold">Email</Typography>
                                <Typography variant="body2">h.eljaouhari.code@gmail.com</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <PhoneIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" fontWeight="bold">Phone</Typography>
                                <Typography variant="body2">+212 07 74 57 41 25</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" fontWeight="bold">Addresses</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>France</strong><br />
                                    9 Avenue de la paix<br />
                                    Châtillon, 92320
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Maroc</strong><br />
                                    Avenue Al Maghreb Al Arabi<br />
                                    Ouarzazate, 40000
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 6, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            We aim to respond to all inquiries within 24-48 hours during business days.
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default Contact;
