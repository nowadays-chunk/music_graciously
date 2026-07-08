import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../data/seo';
import Link from 'next/link';

const RefundPolicy = () => {
    return (
        <>
            <Head>
                <title>Refund & Return Policy | Guitar Sheets Media</title>
                <meta name="description" content="Our refund and return policy for digital sheet music products. Transparent terms on quality resends, shipping fees, and customer protection." />
                <meta name="keywords" content={`${DEFAULT_KEYWORDS}, refund policy, digital goods, customer protection`} />
            </Head>
            <Container maxWidth="md" sx={{ py: 15 }}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, border: '1px solid #eee', borderRadius: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Refund & Return Policy
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last Updated: {new Date().toLocaleDateString()}
                    </Typography>
                    <Divider sx={{ my: 4 }} />

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Overview
                        </Typography>
                        <Typography variant="body1" paragraph>
                            As part of our commitment to transparency, this policy is maintained in plain language and kept up to date. All orders at Guitar Sheets Media are subject to a <strong>shipping and handling fee</strong> (see our{' '}
                            <Link href="/shipping-policy" style={{ color: 'inherit', fontWeight: 700 }}>
                                Shipping Policy
                            </Link>
                            ) in addition to the product price. Please review the full terms below before completing your purchase.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            1. Product Types & Return Eligibility
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Digital Assets (PDF Bundles & Sheets):</strong> Due to the nature of digital goods, which are transmitted to your email after fulfillment, we generally <strong>do not accept returns or issue refunds</strong> once the files have been sent. Digital products cannot be physically "returned" or retrieved once delivered.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Physical Goods (Music Theory Apparel):</strong> Our music theory apparel is printed locally on premium 100% cotton garments using high-definition techniques. To ensure complete satisfaction, we back all apparel purchases with a 30-day easy exchanges and returns guarantee.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            2. Shipping & Handling Fees
                        </Typography>
                        <Typography variant="body1" paragraph>
                            A <strong>shipping and handling fee</strong> applies to all orders. This fee covers the manual review and secure delivery of your digital assets and is non-refundable once an order has entered the fulfillment process. The fee is clearly displayed at checkout before you confirm payment.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            3. Quality Resend Guarantee
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We are committed to providing high-quality music theory references. If you receive a product that contains mistakes, formatting errors, or quality issues, we offer a <strong>Quality Resend Guarantee</strong>: we will send you a corrected and improved version of the product at no additional cost. This applies regardless of the shipping fee paid.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            4. Exceptional Circumstances
                        </Typography>
                        <Typography variant="body1" paragraph>
                            In cases where an order was never delivered (e.g., wrong email address provided, or a proven technical failure on our end), we will either resend the order or, at our discretion, issue a partial or full refund. Please contact us within <strong>7 days</strong> of your expected delivery date if you have not received your files.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            5. Legal Integrity & Mutual Protection
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We strictly abide by international standards for digital commerce. Both the consumer and the owner (Hamza Eljaouhari) are protected by these clauses to prevent conflictual issues. The owner's liability is strictly capped at the amount of the individual purchase. This framework ensures a transparent relationship where everyone is free of undue responsibility.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            6. Requesting Assistance
                        </Typography>
                        <Typography variant="body1" paragraph>
                            To request a corrected version or to report an issue with your purchase, please email us with your order details. We aim to respond within 2 working days.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            7. Contact Information
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

export default RefundPolicy;
