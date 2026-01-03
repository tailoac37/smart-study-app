import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Call actual API
            const response = await authAPI.login({
                usernameOrEmail: formData.username,
                password: formData.password
            });

            const { accessToken, id, username, email, role } = response.data;

            const user = {
                id,
                username,
                email,
                role,
                fullName: username // Or fetch profile if needed, but username is fine for now
            };

            onLogin(user, accessToken);
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container fade-in">
                <div className="login-left">
                    <div className="login-branding">
                        <div className="brand-icon">🎓</div>
                        <h1 className="brand-title">Smart Study</h1>
                        <p className="brand-subtitle">Quản Lý Học Tập Thông Minh</p>
                    </div>
                    <div className="login-features">
                        <div className="feature-item">
                            <span className="feature-icon">📅</span>
                            <span className="feature-text">Quản lý thời khóa biểu</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📝</span>
                            <span className="feature-text">Theo dõi deadline bài tập</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📈</span>
                            <span className="feature-text">Tính điểm trung bình tự động</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📚</span>
                            <span className="feature-text">Chia sẻ tài liệu học tập</span>
                        </div>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-form-container">
                        <div className="login-header">
                            <h2>Đăng Nhập</h2>
                            <p>Chào mừng bạn quay trở lại!</p>
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <label htmlFor="username" className="input-label">
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="input"
                                    placeholder="Nhập tên đăng nhập"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="password" className="input-label">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="input"
                                    placeholder="Nhập mật khẩu"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span>Ghi nhớ đăng nhập</span>
                                </label>
                                <a href="#" className="forgot-link">Quên mật khẩu?</a>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                        <span>Đang đăng nhập...</span>
                                    </>
                                ) : (
                                    'Đăng Nhập'
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>
                                Chưa có tài khoản?{' '}
                                <Link to="/register" className="register-link">
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
