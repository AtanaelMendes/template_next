import dynamic from 'next/dynamic'
import Loading from '@/components/Layouts/Loading'
import WarningMessage from '../../Layouts/WarningMessage'
const PieChart = dynamic(() => import('@/components/chart/PieChart'), {
    ssr: false,
})
import { empty } from '@/assets/utils'

const TotalDosEncaminhamentos = ({ chartData, isReady }) => {
    return (
        <>
            {!isReady ? (
                <Loading active={true} className='mt-8 relative' />
            ) : !empty(chartData) ? (
                <PieChart chartData={chartData} nmChart={'chart_total_encaminhamentos'} />
            ) : (
                <div className='m-8'>
                    <WarningMessage
                        subTitle={"Nenhum registro encontrado para o período selecionado!"}
                    />
                </div>
            )}
        </>
    )
}

export default TotalDosEncaminhamentos
