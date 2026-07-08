import React from 'react';
import { Container, Typography, Box, Paper, Divider, Alert } from '@mui/material';
import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../data/seo';

const ShippingPolicy = () => {
    return (
        <>
            <Head>
                <title>Shipping Policy | Guitar Sheets Media</title>
                <meta name="description" content="Shipping and delivery information for Guitar Sheets Media products. Digital delivery by email within 2–3 working days. Shipping costs apply." />
                <meta name="keywords" content={`${DEFAULT_KEYWORDS}, shipping policy, digital shipping, delivery timeframe, music theory`} />
            </Head>
            <Container maxWidth="md" sx={{ py: 15 }}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, border: '1px solid #eee', borderRadius: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Shipping Policy
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last Updated: {new Date().toLocaleDateString()}
                    </Typography>
                    <Divider sx={{ my: 4 }} />

                    {/* Shipping cost notice */}
                    <Box
                        sx={{
                            mb: 4,
                            p: 2.5,
                            bgcolor: '#fff8e1',
                            border: '2px solid #f0b429',
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                            ⚠️ Shipping Is Not Free
                        </Typography>
                        <Typography variant="body2">
                            A shipping & handling fee applies to all orders. The exact cost is calculated at checkout based on your order total and destination. This fee covers the manual review, validation, and secure delivery of your digital assets by the owner.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            1. Delivery Methods
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Digital Assets (PDF Bundles & Sheets):</strong> Delivered exclusively by email to the address you provide at checkout.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Physical Goods (Music Theory Apparel):</strong> Our music theory apparel is printed locally on premium 100% cotton garments using high-definition techniques. To ensure complete satisfaction, we back all apparel purchases with a 30-day easy exchanges and returns guarantee. Apparel orders are processed and shipped from local printing facilities.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            2. Shipping & Handling Fees
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Unlike automated download platforms, every order at Guitar Sheets Media is <strong>manually reviewed and validated</strong> by the owner before delivery. This human step ensures you receive the most accurate, up-to-date version of the materials you purchased.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            A <strong>shipping and handling fee</strong> is applied to each order to reflect this manual fulfillment process. The fee is displayed transparently at checkout before you confirm payment — there are no hidden charges.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            3. Delivery Timeframe
                        </Typography>
                        <Typography variant="body1" paragraph>
                            After your payment is confirmed, delivery typically takes <strong>2 to 3 working days</strong>. This allows the owner sufficient time to review your order, prepare the correct files, and send them securely to your email address.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            If you have not received your files within 3 working days, please contact us at <strong>h.eljaouhari.code@gmail.com</strong> with your order reference.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            4. Secure Delivery Process
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Digital goods are sent directly via email to the address provided at checkout. We collect your contact information solely to ensure private and secure delivery. This buyer-only access prevents unauthorised distribution and protects your transaction.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            5. Asset Integrity & Compliance
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Our shipping policy is fully aligned with <strong>Google Merchant Center</strong> transparency standards. By manually validating each transaction, we protect the project's intellectual property while ensuring you receive exactly what was advertised.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            6. Contact Information
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Email:</strong> h.eljaouhari.code@gmail.com<br />
                            <strong>Phone:</strong> +212 07 74 57 41 25<br />
                            <strong>Address 1:</strong> 9 Avenue de la paix, Châtillon, 92320 France<br />
                            <strong>Address 2:</strong> Avenue Al Maghreb Al Arabi, Ouarzazate, 40000 Maroc
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default ShippingPolicy;
