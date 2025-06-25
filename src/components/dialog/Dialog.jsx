import React from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import styles from './Dialog.module.scss';
import PropTypes from 'prop-types';

const Dialog = ({ title, children, onClose }) => {
    const element = document.getElementById('modal-root') || document.body;
    return createPortal(
        <FocusTrap>
            <div className={styles.overlay} role="dialog" aria-modal="true">
                <div className={styles.content}>
                    <header className={`${styles.header} ${!title ? styles.noTitle : ''}`}>
                        {title && <h2>{title}</h2>}
                        <button
                            aria-label="Close dialog"
                            onClick={onClose}
                            className={styles.close}
                        >
                            ×
                        </button>
                    </header>
                    <div className={styles.body}>{children}</div>
                </div>
            </div>
        </FocusTrap>,
        element
    );
};

Dialog.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Dialog;
