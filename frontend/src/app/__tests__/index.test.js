
/**
 * @jest-environment jsdom
 */


import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import Home from '../page'


test('Home', () => {
    render(<Home />)
 
    const SearchBlock = screen.getByTitle("SearchBlock")
    const NewProductButton = screen.getByTitle("NewProductButton")
    const ProductTable = screen.getByTitle("ProductTable")
    const Pagination = screen.getByTitle("Pagination")
    const CategoryMetrics = screen.getByTitle("CategoryMetrics")

    expect(SearchBlock).toBeInTheDocument()
    expect(NewProductButton).toBeInTheDocument()
    expect(ProductTable).toBeInTheDocument()
    expect(Pagination).toBeInTheDocument()
    expect(CategoryMetrics).toBeInTheDocument()
  })