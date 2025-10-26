import { Hono } from 'hono'
import { getLog } from './singleton'
import { NotificationFactory, NotificationType } from './factory'
import { StockMarket } from './observer'

const app = new Hono()

app.get('/singleton', (c) => {
  getLog().loggin("teste", "warn")
  return c.text(getLog().logs.toString())
})

app.get('/singleton/logs', (c) => {
  const logs = getLog().logs.reverse()
  return c.json(`{recentLogs: ${logs}}`)
})


type FactoryRequest = {
  type: NotificationType,
	subject: string,
	message: string,
	destination: string
}
app.post('/factory', async (c) => {
  const request = await c.req.json<FactoryRequest>()
  
  const notificationService = NotificationFactory.createNotificationService(request.type)
  notificationService.sendNotification(request.destination, request.subject, request.message)
  
  return c.json(`{message: enviando ${request.type} para ${request.destination}}`)
})


app.get('/observer', (c) => {
  const market = new StockMarket()

  market.subscribe("changeprice", "listener1")
  market.subscribe("changeprice2", "listener1")
  market.subscribe("changeprice", "listener2")
  market.notify("changeprice", "")
  market.notify("changeprice2", "")
  
  return c.json("consultar terminal")
})

export default app