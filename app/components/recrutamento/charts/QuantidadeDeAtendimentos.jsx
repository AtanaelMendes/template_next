import dynamic from 'next/dynamic'
import Loading from '@/components/Layouts/Loading'
import WarningMessage from '../../Layouts/WarningMessage'
const YearlySeriesChart = dynamic(() => import('@/components/chart/YearlySeriesChart'), {
    ssr: false,
})
import { empty } from '@/assets/utils'

const QuantidadeDeAtendimentos = ({ chartData, chartDataComp, isReady }) => {
    return (
        <>
            {!isReady ? (
                <Loading active={true} className='mt-8 relative' />
            ) : !empty(chartData) && !empty(chartDataComp) ? (
                <YearlySeriesChart
                    yearlyData={chartData}
                    monthlyData={chartDataComp}
                    nmChart={'chart_quantidade_atendimentos'}
                    showRootButton={true}
                    buttonLabel={'Ver anos'}
                />
            ) : (
                <div className='m-8 h-full items-center flex'>
                    <WarningMessage
                        subTitle={"Nenhum registro encontrado para o período selecionado!"}
                    />
                </div>
            )}
        </>
    )
}

export default QuantidadeDeAtendimentos
