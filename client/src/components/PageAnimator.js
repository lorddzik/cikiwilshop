import React from 'react';
import { motion } from 'framer-motion';

// Ini adalah variasi animasi yang akan kita gunakan
// initial: Mulai dari opacity 0 (transparan)
// animate: Menjadi opacity 1 (terlihat)
// exit: Kembali ke opacity 0 (transparan) saat halaman ditutup
const animations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

const PageAnimator = ({ children }) => {
    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }} // Atur durasi animasi di sini
        >
            {children}
        </motion.div>
    );
};

export default PageAnimator;