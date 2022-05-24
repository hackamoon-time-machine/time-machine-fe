import Layouts from 'components/Layouts';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

export default function WrapperRoute() {
  return (
    <Routes>
      <Route path="/" element={<Layouts />}></Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
