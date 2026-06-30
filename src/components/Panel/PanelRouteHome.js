import React from 'react'
import { motion } from 'framer-motion'
import StorageIcon from '@mui/icons-material/Storage'
import CardRouteHome from '@/elements/CardRouteHome';
import { BarChartIcon } from 'lucide-react';


export default function PanelRouteHome({
    itemVariants = {},
    BD_ROUTES = [],
    isGraph=false
}) {
  return (
      <motion.div variants={itemVariants}>
           <div className="flex items-center gap-2 mb-3">
                {isGraph ? <BarChartIcon style={{ fontSize : 18, color : '#1F4363'}} /> : <StorageIcon style={{ fontSize: 18, color: '#1F4363' }} />}
                <h2 className="font-bold text-[#1F4363] text-sm uppercase tracking-wider">Base de Datos</h2>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
              {
                  BD_ROUTES?.map((route, idx) => {
                      const Icon = route.icon;
                      return  <CardRouteHome  key={route?.path} Icon={Icon} route={ route} idx={idx} />
                  })
              }
          </div>
    </motion.div>
  )
};