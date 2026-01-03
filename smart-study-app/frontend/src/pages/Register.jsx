import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: '',
        studentId: '',
        role: 'STUDENT',
        studentYear: 1
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            await authAPI.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                role: formData.role,
                studentYear: parseInt(formData.studentYear) || 1
            });
            setSuccess(true);
        } catch (err) {
            console.error('Register error:', err);
            setError(typeof err.response?.data === 'string' ? err.response.data : 'Đăng ký thất bại. Vui lòng thử lại.');
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
                        <p className="brand-subtitle">Bắt đầu hành trình học tập của bạn</p>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-form-container">
                        <div className="login-header">
                            <h2>Đăng Ký</h2>
                            <p>Tạo tài khoản mới</p>
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success">
                                Đăng ký thành công! <Link to="/login">Đăng nhập ngay</Link>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <label htmlFor="fullName" className="input-label">Họ và tên</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    className="input"
                                    placeholder="Nhập họ và tên"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="username" className="input-label">Tên đăng nhập</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="input"
                                    placeholder="Nhập tên đăng nhập"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="email" className="input-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="input"
                                    placeholder="Nhập email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="role" className="input-label">Bạn là</label>
                                <select
                                    id="role"
                                    name="role"
                                    className="input"
                                    value={formData.role || 'STUDENT'}
                                    onChange={handleChange}
                                >
                                    <option value="STUDENT">Sinh viên</option>
                                    <option value="TEACHER">Giảng viên</option>
                                </select>
                            </div>

                            {formData.role === 'STUDENT' && (
                                <div className="input-group">
                                    <label htmlFor="studentYear" className="input-label">Năm học</label>
                                    <select
                                        id="studentYear"
                                        name="studentYear"
                                        className="input"
                                        value={formData.studentYear || 1}
                                        onChange={handleChange}
                                    >
                                        <option value="1">Năm 1</option>
                                        <option value="2">Năm 2</option>
                                        <option value="3">Năm 3</option>
                                        <option value="4">Năm 4</option>
                                        <option value="5">Năm 5</option>
                                    </select>
                                </div>
                            )}

                            <div className="input-group">
                                <label htmlFor="studentId" className="input-label">Mã số (SV/GV)</label>
                                <input
                                    type="text"
                                    id="studentId"
                                    name="studentId"
                                    className="input"
                                    placeholder="Nhập mã sinh viên hoặc mã giảng viên"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="password" className="input-label">Mật khẩu</label>
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

                            <div className="input-group">
                                <label htmlFor="confirmPassword" className="input-label">Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="input"
                                    placeholder="Nhập lại mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                                {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>
                                Đã có tài khoản?{' '}
                                <Link to="/login" className="register-link">
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
