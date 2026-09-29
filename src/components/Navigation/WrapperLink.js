'use client'
import React from 'react'
import Text from '../Titles/Text';
import Link from 'next/link';

export default function WrapperLink({ href, children }) {
  return (
    <div className="px-4 py-2 hover:bg-gray-100 rounded-md">
      <Link href={href}>
        <Text>{children}</Text>
      </Link>
    </div>
  );
}
