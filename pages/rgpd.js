import React from 'react';
import Head from 'next/head';
import { Box } from '@mui/material';
import ArticleCard from '../components/Listing/ArticleCard';
import { DEFAULT_KEYWORDS } from '../data/seo';

const firstPage = `# Privacy Policy (RGPD) for www.musicgraciously.com

## Introduction
Welcome to www.musicgraciously.com (the "Site"). This Privacy Policy outlines how we handle your personal information in compliance with the General Data Protection Regulation (GDPR). We are committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible manner.

## Data We Collect
We do not collect any personal data through cookies or other tracking technologies. Our Site does not use cookies, nor does it require user authentication. The only data we collect are the information you voluntarily provide to us.

## How We Use Your Data
As we do not collect personal data through cookies or authentication, the only personal data we may have is what you provide to us directly, such as through contact forms or email inquiries. This data will be used solely for the purpose of responding to your queries and providing you with the information or services you requested.

## Legal Basis for Processing
Under the GDPR, the legal basis for processing your personal data is your consent. By providing your personal information, you consent to its use for the purposes stated above.

## Sharing Your Data
We do not share your personal data with any third parties. Your information will only be used by www.musicgraciously.com to respond to your inquiries and provide the services you request.

## Data Retention
We will retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable laws and regulations.

## Your Rights
Under the GDPR, you have the following rights regarding your personal data:
- The right to access the personal data we hold about you.
- The right to request the correction of inaccurate data.
- The right to request the deletion of your personal data.
- The right to restrict or object to the processing of your data.
- The right to data portability.
- The right to withdraw your consent at any time.

To exercise any of these rights, please contact us at [Your Contact Information].

## Security of Your Data
We take appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse. However, please note that no internet-based site can be 100% secure, and we cannot be held responsible for unauthorized or unintended access that is beyond our control.

## Changes to This Privacy Policy
We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we will notify you of any significant changes by updating the date at the top of this policy.

## Contact Us
If you have any questions or concerns about this Privacy Policy or how we handle your personal data, please contact us at:

www.musicgraciously.com

Thank you for visiting www.musicgraciously.com! We value your privacy and are committed to protecting your personal data.`;

const CoverOne = () => {
    return (
        <>
            <Head>
                <title>Privacy Policy (RGPD) | Guitar Sheets</title>
                <meta
                    name="description"
                    content="Privacy Policy and GDPR compliance information for www.musicgraciously.com. Learn how we protect your personal data and respect your privacy rights."
                />
                <meta
                    name="keywords"
                    content={`${DEFAULT_KEYWORDS}, privacy policy, GDPR, RGPD, data protection`}
                />
            </Head>
            <Box sx={{ pt: { xs: '80px', sm: '100px' }, pb: '100px' }}>
                <ArticleCard article={{
                    content: firstPage
                }}></ArticleCard>
            </Box>
        </>
    );
};

export default CoverOne;
