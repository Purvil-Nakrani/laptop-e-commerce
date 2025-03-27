import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  // Get the current year dynamically to display in the copyright text
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <Container fluid className="bg-dark text-light mt-5 py-4">
        <Row className="text-center">
          {/* About Section */}
          <Col md={4} className="mb-3">
            <h5>About Us</h5>
            <p>
              MERN Shop is your one-stop online store for the best deals on
              electronics, fashion, and more!
            </p>
          </Col>

          {/* Quick Links Section */}
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">Home</a></li>
              <li><a href="/cart" className="text-light">Cart</a></li>
              <li><a href="/" className="text-light">Privacy Policy</a></li>
              <li><a href="/" className="text-light">Terms & Conditions</a></li>
            </ul>
          </Col>

          {/* Contact Section */}
          <Col md={4} className="mb-3 text-left">
            <h5>Contact Us</h5>
            <p>Email: support@mernshop.com</p>
            <p>Phone: +1 (123) 456-7890</p>
            <p>Address: 123 MERN Street, Tech City, Surat</p>
          </Col>
        </Row>

        {/* Copyright Section */}
        <Row className="text-center">
          <Col className="pt-3">
            <p className="m-0">MERN Shop &copy; {currentYear}. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
