import React from 'react';
import { Container, Pagination } from 'react-bootstrap';

const Paginate = ({ currentPage, totalPage, pageHandler }) => {
  return (
    <Container className='d-flex justify-content-center mt-5'>
      <Pagination size='sm'>

        {/* First Page Button - Disabled if on the first page */}
        <Pagination.First
          onClick={() => pageHandler(1)}
          disabled={currentPage <= 1}
        />

        {/* Previous Page Button - Disabled if on the first page */}
        <Pagination.Prev
          onClick={() => pageHandler(currentPage - 1)}
          disabled={currentPage <= 1}
        />

        {/* Dynamically generate page numbers */}
        {[...Array(totalPage)].map((_, i) => (
          <Pagination.Item
            key={i}
            active={i + 1 === currentPage} // Highlight active page
            onClick={() => pageHandler(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}

        {/* Next Page Button - Disabled if on the last page */}
        <Pagination.Next
          onClick={() => pageHandler(currentPage + 1)}
          disabled={currentPage >= totalPage}
        />

        {/* Last Page Button - Disabled if on the last page */}
        <Pagination.Last
          onClick={() => pageHandler(totalPage)}
          disabled={currentPage >= totalPage}
        />

      </Pagination>
    </Container>
  );
};

export default Paginate;
