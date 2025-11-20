import dynamic from 'next/dynamic'
import Loading from '@/components/Layouts/Loading'
import WarningMessage from '../../Layouts/WarningMessage'
const PieChart = dynamic(() => import('@/components/chart/PieChart'), {
    ssr: false,
})
import { empty } from '@/assets/utils'

const AtendimentosPorRecrutador = ({ chartData, isReady }) => {
    return (
        <>
            {!isReady ? (
                <Loading active={true} className='mt-8 relative' />
            ) : !empty(chartData) ? (
                <PieChart chartData={chartData} nmChart={'chart_qtd_atendimentos_recrutador'} />
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

export default AtendimentosPorRecrutador
