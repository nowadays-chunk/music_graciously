import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../data/seo';
import Link from 'next/link';

const TermsOfService = () => {
    return (
        <>
            <Head>
                <title>Terms of Service | Guitar Sheets Media</title>
                <meta name="description" content="Terms and conditions for using Guitar Sheets Media. Ownership by Hamza Eljaouhari, security disclosures, and legal protections." />
                <meta name="keywords" content={`${DEFAULT_KEYWORDS}, legal, ownership, security, terms of service`} />
            </Head>
            <Container maxWidth="md" sx={{ py: 15 }}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, border: '1px solid #eee', borderRadius: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Terms of Service
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last Updated: {new Date().toLocaleDateString()}
                    </Typography>
                    <Divider sx={{ my: 4 }} />

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">1. Ownership and Beneficiary</Typography>
                        <Typography variant="body1" paragraph>
                            This project, the domain <strong>www.sheets.media</strong>, and all associated intellectual property are registered under the name <strong>Hamza Eljaouhari</strong>. Hamza Eljaouhari is the sole maker, maintainer, and beneficiary of this project, including all Ad revenues and product purchase proceeds.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">2. Security and Architecture</Typography>
                        <Typography variant="body1" paragraph>
                            Our platform is architected for maximum security and performance. We do not run a traditional backend server; the site is built as a highly optimized static/client-side application. This "No-Backend" approach significantly reduces the attack surface, making it virtually impossible for traditional database breaches to threaten our customers' data.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            The website is hosted in the <strong>United States of America</strong> on <strong>Vercel.com</strong> using robust containerized infrastructure. This adds hundreds of layers of enterprise-grade security, ensuring a safe browsing and shopping experience.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">3. Product Availability & GMC Compliance</Typography>
                        <Typography variant="body1" paragraph>
                            We comply with Google Merchant Center (GMC) requirements for transparency. Prices, currency (EUR), and availability are matched precisely between our data feed and the landing pages.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Products may occasionally be marked as "Unavailable" if the developer is currently regenerating or updating the digital assets. Please check the <Link href="/changelog">Changelog</Link> for the latest updates on project development.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">Evolution of Service</Typography>
                        <Typography variant="body1" paragraph>
                            We are dedicated to continuous improvement. <strong>Our website is being refined and reedited repeatedly</strong> to ensure it stays aligned with our users' consents and provides a preferred personal utmost experience.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">4. International Payments</Typography>
                        <Typography variant="body1" paragraph>
                            We use <strong>Stripe Payment Links</strong> to secure all financial transactions. This ensures that sensitive banking information is handled by one of the world's most secure and trusted payment processors, certified to PCI Service Provider Level 1.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">5. Legal Framework and Stakeholder Assurance</Typography>
                        <Typography variant="body1" paragraph>
                            This platform operates under a framework of complete transparency and accountability. We provide robust protection for our customers' data as detailed in our <Link href="/rgpd">Privacy Policy</Link>. As a stakeholder-first project, we ensure that both the consumer and the owner (Hamza Eljaouhari) are legally protected against conflictual situations.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            By engaging with this site, customers agree to a structured release of responsibility, acknowledging that while every effort is made to maintain 100% uptime and data integrity through our Vercel-hosted USA infrastructure, the service is provided on an "as-is" basis for educational and commercial purposes. This balance of responsibility ensures that the project remains viable and free from malicious or unfounded litigious threats.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">6. Contact Information</Typography>
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

export default TermsOfService;
